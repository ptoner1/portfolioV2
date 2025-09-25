interface ImportMetaEnv {
    readonly VITE_CONTACT_EMAIL_URL: string,
    readonly VITE_PAULS_FAV_Painting1: string,
    readonly VITE_PAULS_FAV_Painting2: string,
    readonly VITE_PAULS_FAV_Painting3: string,
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }
