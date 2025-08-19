declare module 'vcards-js' {
  type VCardPhoto = {
    attachFromUrl: (url: string, format: string) => void;
    embedFromFile: (path: string) => void;
    embedFromString: (base64: string, mimeType: string) => void;
  };

  type VCardAddress = {
    label: string;
    street: string;
    city: string;
    stateProvince: string;
    postalCode: string;
    countryRegion: string;
  };

  type VCard = {
    firstName: string;
    middleName: string;
    lastName: string;
    organization: string;
    title: string;
    birthday: Date;
    cellPhone: string;
    email: string;
    url: string;
    note: string;
    photo: VCardPhoto;
    logo: VCardPhoto;
    homeAddress: VCardAddress;
    workAddress: VCardAddress;
    socialUrls: Record<string, string>;
    version: string;
    isOrganization: boolean;
    uid: string;
    nickname: string;
    namePrefix: string;
    nameSuffix: string;
    gender: string;
    anniversary: Date;
    role: string;
    workPhone: string;
    homePhone: string;
    pagerPhone: string;
    homeFax: string;
    workFax: string;
    workEmail: string;
    otherEmail: string;
    otherPhone: string;
    source: string;
    workUrl: string;
    saveToFile: (path: string) => void;
    getFormattedString: () => string;
  };

  function vCardsJS(): VCard;
  export = vCardsJS;
}
