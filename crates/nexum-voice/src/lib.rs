//! Voice commands for Nexum.
//!
//! [`match_mode`] turns what the user said (a transcript from the speech
//! recognizer) into the mode to activate. It is deliberately forgiving:
//! case, accents, punctuation, filler words ("lance le mode …", "active …")
//! and small transcription mistakes ("gamming") are all tolerated.

use nexum_schema::{Category, Mode};

#[cfg(feature = "whisper")]
pub mod recorder;
#[cfg(feature = "whisper")]
pub mod transcriber;

/// Words that frame a command but never name a mode (French and English).
const FILLER: &[&str] = &[
    "a", "active", "activer", "activez", "activate", "au", "demarre", "demarrer", "demarrez", "en",
    "est", "il", "l", "la", "lance", "lancer", "lancez", "le", "les", "mode", "mets", "mettre",
    "nexum", "on", "passe", "passer", "please", "plait", "profil", "s", "start", "stp", "svp",
    "switch", "te", "the", "to", "un", "une", "launch",
];

/// What a transcript asks for.
#[derive(Debug, PartialEq)]
pub enum Recognized<'a> {
    Mode(&'a Mode),
    /// Several modes fit equally well: the user has to be more specific, for
    /// example by giving one of them a voice keyword.
    Ambiguous(Vec<&'a Mode>),
    Nothing,
}

/// Recognise the mode a transcript asks for.
///
/// A mode is named by its name or one of its voice keywords: every word of
/// that phrase must be heard, and the longest phrase wins ("Gaming Ranked"
/// over "Gaming"). If nothing is named, a category word ("jeu", "détente"…)
/// picks the mode of that category.
pub fn recognize<'a>(transcript: &str, modes: &'a [Mode]) -> Recognized<'a> {
    let heard: Vec<String> = words(transcript)
        .into_iter()
        .filter(|w| !FILLER.contains(&w.as_str()))
        .collect();
    if heard.is_empty() {
        return Recognized::Nothing;
    }
    let mut found = by_name(&heard, modes);
    if found.is_empty() {
        found = by_category(&heard, modes);
    }
    match found.as_slice() {
        [] => Recognized::Nothing,
        [mode] => Recognized::Mode(mode),
        _ => Recognized::Ambiguous(found),
    }
}

/// The mode the transcript asks for, or `None` if no mode was recognised or
/// several match equally well. See [`recognize`].
pub fn match_mode<'a>(transcript: &str, modes: &'a [Mode]) -> Option<&'a Mode> {
    match recognize(transcript, modes) {
        Recognized::Mode(mode) => Some(mode),
        _ => None,
    }
}

/// The modes whose longest fully heard name or keyword is the longest of all.
fn by_name<'a>(heard: &[String], modes: &'a [Mode]) -> Vec<&'a Mode> {
    let scored: Vec<(&Mode, usize)> = modes
        .iter()
        .filter_map(|mode| {
            std::iter::once(&mode.name)
                .chain(&mode.voice_keywords)
                .map(|phrase| words(phrase))
                .filter(|phrase| {
                    !phrase.is_empty() && phrase.iter().all(|n| heard.iter().any(|h| similar(h, n)))
                })
                .map(|phrase| phrase.len())
                .max()
                .map(|len| (mode, len))
        })
        .collect();
    let best = scored.iter().map(|(_, len)| *len).max().unwrap_or(0);
    scored
        .into_iter()
        .filter(|(_, len)| *len == best)
        .map(|(mode, _)| mode)
        .collect()
}

/// The modes in every category a category word was heard for.
fn by_category<'a>(heard: &[String], modes: &'a [Mode]) -> Vec<&'a Mode> {
    let named: Vec<Category> = CATEGORIES
        .iter()
        .filter(|(_, synonyms)| synonyms.iter().any(|s| heard.iter().any(|h| similar(h, s))))
        .map(|(category, _)| *category)
        .collect();
    modes
        .iter()
        .filter(|m| named.contains(&m.category))
        .collect()
}

/// Built-in words for each category, French and English, accent-free.
const CATEGORIES: &[(Category, &[&str])] = &[
    (
        Category::Gaming,
        &["jeu", "jeux", "jouer", "game", "games", "gamer"],
    ),
    (
        Category::Work,
        &[
            "travail",
            "travailler",
            "boulot",
            "bureau",
            "work",
            "focus",
            "concentration",
        ],
    ),
    (
        Category::Chill,
        &[
            "detente", "detendre", "repos", "relax", "relaxe", "calme", "chill",
        ],
    ),
    (
        Category::Streaming,
        &["stream", "streaming", "live", "direct"],
    ),
    (
        Category::Night,
        &["nuit", "soir", "dormir", "dodo", "night"],
    ),
];

/// Lowercase, accent-free words: "Soirée Chill !" -> ["soiree", "chill"].
fn words(text: &str) -> Vec<String> {
    let folded: String = text.chars().flat_map(fold).collect();
    folded
        .split(|c: char| !c.is_ascii_alphanumeric())
        .filter(|w| !w.is_empty())
        .map(str::to_owned)
        .collect()
}

fn fold(c: char) -> Vec<char> {
    match c {
        'à' | 'â' | 'ä' | 'á' | 'À' | 'Â' | 'Ä' | 'Á' => vec!['a'],
        'é' | 'è' | 'ê' | 'ë' | 'É' | 'È' | 'Ê' | 'Ë' => vec!['e'],
        'î' | 'ï' | 'í' | 'Î' | 'Ï' | 'Í' => vec!['i'],
        'ô' | 'ö' | 'ó' | 'Ô' | 'Ö' | 'Ó' => vec!['o'],
        'ù' | 'û' | 'ü' | 'ú' | 'Ù' | 'Û' | 'Ü' | 'Ú' => vec!['u'],
        'ç' | 'Ç' => vec!['c'],
        'œ' | 'Œ' => vec!['o', 'e'],
        'æ' | 'Æ' => vec!['a', 'e'],
        _ => c.to_lowercase().collect(),
    }
}

/// Equal, or close enough to be a transcription slip: one edit for words of
/// 4+ letters, two for 8+. Short words must match exactly ("tv" != "pc").
fn similar(heard: &str, name: &str) -> bool {
    let allowed = match name.len() {
        0..=3 => 0,
        4..=7 => 1,
        _ => 2,
    };
    heard == name || (allowed > 0 && edit_distance(heard, name) <= allowed)
}

fn edit_distance(a: &str, b: &str) -> usize {
    let b: Vec<char> = b.chars().collect();
    let mut prev: Vec<usize> = (0..=b.len()).collect();
    for (i, ca) in a.chars().enumerate() {
        let mut cur = vec![i + 1];
        for (j, cb) in b.iter().enumerate() {
            let cost = usize::from(ca != *cb);
            cur.push((prev[j] + cost).min(prev[j + 1] + 1).min(cur[j] + 1));
        }
        prev = cur;
    }
    prev[b.len()]
}

#[cfg(test)]
mod tests {
    use super::*;
    use uuid::Uuid;

    fn modes(names: &[&str]) -> Vec<Mode> {
        names
            .iter()
            .enumerate()
            .map(|(i, name)| Mode {
                id: Uuid::from_u128(i as u128),
                name: (*name).into(),
                description: None,
                category: Category::Custom,
                steps: vec![],
                voice_keywords: vec![],
            })
            .collect()
    }

    fn heard<'a>(transcript: &str, modes: &'a [Mode]) -> Option<&'a str> {
        match_mode(transcript, modes).map(|m| m.name.as_str())
    }

    #[test]
    fn understands_french_and_english_commands() {
        let m = modes(&["Gaming", "Travail", "Soirée Chill"]);
        assert_eq!(heard("Lance le mode gaming.", &m), Some("Gaming"));
        assert_eq!(
            heard("active le mode travail s'il te plaît", &m),
            Some("Travail")
        );
        assert_eq!(heard("Passe en soirée chill !", &m), Some("Soirée Chill"));
        assert_eq!(heard("launch gaming", &m), Some("Gaming"));
        assert_eq!(heard("Gaming", &m), Some("Gaming"));
    }

    #[test]
    fn ignores_accents_and_case() {
        let m = modes(&["Soirée Chill"]);
        assert_eq!(heard("SOIREE CHILL", &m), Some("Soirée Chill"));
    }

    #[test]
    fn tolerates_small_transcription_mistakes() {
        let m = modes(&["Gaming", "Streaming"]);
        assert_eq!(heard("lance le mode gamming", &m), Some("Gaming"));
        assert_eq!(heard("lance le mode striming", &m), Some("Streaming"));
    }

    #[test]
    fn needs_every_word_of_the_name() {
        let m = modes(&["Soirée Chill"]);
        assert_eq!(heard("lance le mode chill", &m), None);
    }

    #[test]
    fn prefers_the_most_specific_name() {
        let m = modes(&["Gaming", "Gaming Ranked"]);
        assert_eq!(heard("lance gaming ranked", &m), Some("Gaming Ranked"));
        assert_eq!(heard("lance gaming", &m), Some("Gaming"));
    }

    #[test]
    fn refuses_unknown_or_ambiguous_requests() {
        let m = modes(&["Gaming", "Travail"]);
        assert_eq!(heard("lance le mode", &m), None);
        assert_eq!(heard("quelle heure est-il", &m), None);
        assert_eq!(heard("gaming ou travail", &m), None);
    }

    #[test]
    fn short_names_must_match_exactly() {
        let m = modes(&["TV"]);
        assert_eq!(heard("mode tv", &m), Some("TV"));
        assert_eq!(heard("mode pc", &m), None);
    }

    fn mode(name: &str, category: Category, keywords: &[&str]) -> Mode {
        Mode {
            id: Uuid::new_v4(),
            name: name.into(),
            description: None,
            category,
            steps: vec![],
            voice_keywords: keywords.iter().map(|k| (*k).into()).collect(),
        }
    }

    #[test]
    fn understands_the_users_own_keywords() {
        let m = [
            mode("Gaming", Category::Gaming, &["partie classée", "ranked"]),
            mode("Work", Category::Work, &["boulot"]),
        ];
        assert_eq!(heard("lance une partie classée", &m), Some("Gaming"));
        assert_eq!(heard("mode ranked", &m), Some("Gaming"));
        assert_eq!(heard("passe en mode boulot", &m), Some("Work"));
    }

    #[test]
    fn falls_back_to_category_words() {
        let m = [
            mode("Gaming", Category::Gaming, &[]),
            mode("Work", Category::Work, &[]),
            mode("Chill", Category::Chill, &[]),
        ];
        assert_eq!(heard("Lance Mode, Jeux.", &m), Some("Gaming"));
        assert_eq!(heard("passe en mode travail", &m), Some("Work"));
        assert_eq!(heard("mode détente", &m), Some("Chill"));
        assert_eq!(heard("jeu ou travail", &m), None);
    }

    #[test]
    fn category_words_need_a_single_mode_in_that_category() {
        let m = [
            mode("Fortnite", Category::Gaming, &[]),
            mode("Minecraft", Category::Gaming, &[]),
        ];
        assert_eq!(heard("lance le mode jeu", &m), None);
        assert_eq!(heard("lance le mode minecraft", &m), Some("Minecraft"));
    }

    #[test]
    fn a_named_mode_beats_a_category_word() {
        let m = [
            mode("Jeu calme", Category::Chill, &[]),
            mode("Gaming", Category::Gaming, &[]),
        ];
        assert_eq!(heard("lance jeu calme", &m), Some("Jeu calme"));
    }

    #[test]
    fn lists_the_modes_when_ambiguous() {
        let m = [
            mode("Work", Category::Work, &[]),
            mode("Focus & Code", Category::Work, &[]),
            mode("Gaming", Category::Gaming, &[]),
        ];
        let names = |r: Recognized| match r {
            Recognized::Ambiguous(modes) => modes.iter().map(|m| m.name.clone()).collect(),
            _ => vec![],
        };
        assert_eq!(
            names(recognize("lance le mode travail", &m)),
            ["Work", "Focus & Code"]
        );
        assert_eq!(recognize("bonjour", &m), Recognized::Nothing);
    }
}
