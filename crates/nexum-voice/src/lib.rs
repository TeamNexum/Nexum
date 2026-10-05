//! Voice commands for Nexum.
//!
//! [`match_mode`] turns what the user said (a transcript from the speech
//! recognizer) into the mode to activate. It is deliberately forgiving:
//! case, accents, punctuation, filler words ("lance le mode …", "active …")
//! and small transcription mistakes ("gamming") are all tolerated.

use nexum_schema::Mode;

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

/// The mode the transcript asks for, or `None` if no mode name was heard or
/// two modes match equally well.
///
/// Every word of a mode's name must be heard; when several modes qualify,
/// the one with the longest name wins ("Gaming Ranked" over "Gaming").
pub fn match_mode<'a>(transcript: &str, modes: &'a [Mode]) -> Option<&'a Mode> {
    let heard: Vec<String> = words(transcript)
        .into_iter()
        .filter(|w| !FILLER.contains(&w.as_str()))
        .collect();
    if heard.is_empty() {
        return None;
    }

    let mut best: Option<(&Mode, usize)> = None;
    let mut tie = false;
    for mode in modes {
        let name = words(&mode.name);
        if name.is_empty() || !name.iter().all(|n| heard.iter().any(|h| similar(h, n))) {
            continue;
        }
        match best {
            Some((_, len)) if name.len() == len => tie = true,
            Some((_, len)) if name.len() < len => {}
            _ => {
                best = Some((mode, name.len()));
                tie = false;
            }
        }
    }
    if tie {
        None
    } else {
        best.map(|(mode, _)| mode)
    }
}

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
    use nexum_schema::Category;
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
}
