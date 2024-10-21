import { MainConfigStore } from '../Store';

export type DictionaryRecord = {
  [key: string]: string | string[] | DictionaryRecord;
};

export const addDictionary = (
  dictionary: DictionaryRecord
) => {
  const { language } = MainConfigStore;

  return {
    Translate: (value: string) => dictionary[language]?.[value] || `i18n! - ${value}`,
    TranslateDict: (value: string, extDictionary: DictionaryRecord) =>
      extDictionary[language]?.[value] || `i18n! - ${value}`,
    TranslateArr: (value: string | string[]) => (
      dictionary[language]?.[value[0]]?.[value[1]]?.[value[2]]?.[value[3]] ||
      dictionary[language]?.[value[0]]?.[value[1]]?.[value[2]] ||
      dictionary[language]?.[value[0]]?.[value[1]] ||
      dictionary[language]?.[value[0]] ||
      `i18n! - ${value}`),
    TranslateArrDict: (value: string[], extDictionary: DictionaryRecord) => (
      extDictionary[language]?.[value[0]]?.[value[1]]?.[value[2]]?.[value[3]] ||
      extDictionary[language]?.[value[0]]?.[value[1]]?.[value[2]] ||
      extDictionary[language]?.[value[0]]?.[value[1]] ||
      extDictionary[language]?.[value[0]] ||
      `i18n! - ${value}`),
  };
};
