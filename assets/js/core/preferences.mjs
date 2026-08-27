const PREFIX = "pagerivet.";

export function readPreference(key, fallback, storage) {
  const fallbackValue = typeof fallback === "undefined" ? null : fallback;
  const target = storage || window.localStorage;
  try {
    const value = target.getItem(PREFIX + key);
    return value === null ? fallbackValue : value;
  } catch (error) {
    return fallbackValue;
  }
}

export function savePreference(key, value, storage) {
  const target = storage || window.localStorage;
  try {
    target.setItem(PREFIX + key, String(value));
    return true;
  } catch (error) {
    return false;
  }
}

export function removePreference(key, storage) {
  const target = storage || window.localStorage;
  try {
    target.removeItem(PREFIX + key);
  } catch (error) {
    // Storage can be unavailable in restricted browser contexts.
  }
}
