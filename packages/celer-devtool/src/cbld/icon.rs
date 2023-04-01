use std::{fs, path::PathBuf};
use celer::core::SourceObject;
use crate::cio::ErrorState;

pub fn load_local_icons(bundle: &mut SourceObject, module_path: &str, out_errors: &mut ErrorState) {
    if bundle.config.icons.is_none() {
        return;
    }

    let icon_map = bundle.config.icons.as_mut().unwrap().underlying_mut();

    icon_map.retain(|_, icon_path| {
        if icon_path.starts_with("http://") {
            out_errors.add(icon_path.clone(), "http is not allowed. Use https instead.".to_string());
            return false;
        }
        if icon_path.starts_with("https://") || icon_path.starts_with("data:") {
            // Non local icons can be directly loaded in the webapp
            return true;
        }

        let icon_data = match fs::read(PathBuf::from(module_path).join(icon_path.clone())) {
            Ok(v) => v,
            Err(e) => {
                out_errors.add(icon_path.clone(), format!("Failed to load icon: {}", e));
                return false;
            }
        };

        *icon_path = format!("data:image/png;base64,{}", base64::encode(icon_data));
        true
    });


}
