/**
 * Static reference data for onboarding location & phone country code pickers.
 *
 * Kept in-app (rather than DB-backed) because:
 *  - Onboarding hits this on first paint — DB roundtrip would slow it down
 *  - The list is curated, not user-generated
 *  - Updates are intentional, not data-driven — bump this file via PR
 */

export interface CountryDialCode {
  /** ISO 3166-1 alpha-2 */
  code: string
  /** Localised name */
  name: string
  /** International dialling prefix, with leading + */
  dial: string
  /** Unicode flag emoji */
  flag: string
}

/**
 * Dialling-code roster.
 * Ordered so Portuguese-speaking countries surface first, then near markets.
 */
export const DIAL_CODES: CountryDialCode[] = [
  { code: 'AO', name: 'Angola',          dial: '+244', flag: '🇦🇴' },
  { code: 'PT', name: 'Portugal',        dial: '+351', flag: '🇵🇹' },
  { code: 'BR', name: 'Brasil',          dial: '+55',  flag: '🇧🇷' },
  { code: 'MZ', name: 'Moçambique',      dial: '+258', flag: '🇲🇿' },
  { code: 'CV', name: 'Cabo Verde',      dial: '+238', flag: '🇨🇻' },
  { code: 'GW', name: 'Guiné-Bissau',    dial: '+245', flag: '🇬🇼' },
  { code: 'ST', name: 'São Tomé',        dial: '+239', flag: '🇸🇹' },
  { code: 'TL', name: 'Timor-Leste',     dial: '+670', flag: '🇹🇱' },
  { code: 'MO', name: 'Macau',           dial: '+853', flag: '🇲🇴' },
  { code: 'ES', name: 'Espanha',         dial: '+34',  flag: '🇪🇸' },
  { code: 'FR', name: 'França',          dial: '+33',  flag: '🇫🇷' },
  { code: 'GB', name: 'Reino Unido',     dial: '+44',  flag: '🇬🇧' },
  { code: 'DE', name: 'Alemanha',        dial: '+49',  flag: '🇩🇪' },
  { code: 'IT', name: 'Itália',          dial: '+39',  flag: '🇮🇹' },
  { code: 'NL', name: 'Países Baixos',   dial: '+31',  flag: '🇳🇱' },
  { code: 'BE', name: 'Bélgica',         dial: '+32',  flag: '🇧🇪' },
  { code: 'CH', name: 'Suíça',           dial: '+41',  flag: '🇨🇭' },
  { code: 'US', name: 'Estados Unidos',  dial: '+1',   flag: '🇺🇸' },
]

export const DEFAULT_DIAL_CODE: CountryDialCode =
  DIAL_CODES.find((c) => c.code === 'AO')!

export function findDialByCode(code?: string | null): CountryDialCode | undefined {
  if (!code) return undefined
  return DIAL_CODES.find((c) => c.code === code)
}

// ─── Locations ────────────────────────────────────────────────────────────────

export interface NeighborhoodNode {
  name: string
  tagline?: string
}

export interface CityNode {
  name: string
  tagline?: string
  neighborhoods: NeighborhoodNode[]
}

export interface CountryNode {
  code: string
  name: string
  flag: string
  cities: CityNode[]
}

/**
 * Curated country → city → neighborhood tree.
 * "tagline" is editorial copy shown under each suggestion in the picker.
 */
export const LOCATIONS: CountryNode[] = [
  {
    code: 'AO',
    name: 'Angola',
    flag: '🇦🇴',
    cities: [
      {
        name: 'Luanda',
        tagline: 'Pulso da Costa',
        neighborhoods: [
          { name: 'Ingombota' },
          { name: 'Maianga' },
          { name: 'Talatona' },
          { name: 'Miramar' },
          { name: 'Alvalade' },
          { name: 'Kilamba' },
          { name: 'Viana' },
          { name: 'Cazenga' },
        ],
      },
      { name: 'Benguela',  tagline: 'Brisa do Atlântico', neighborhoods: [
        { name: 'Centro' }, { name: 'Praia Morena' }, { name: 'Compão' },
      ]},
      { name: 'Huambo',    tagline: 'Planalto Central',   neighborhoods: [
        { name: 'Centro' }, { name: 'Académico' },
      ]},
      { name: 'Lobito',    tagline: 'Restinga',           neighborhoods: [
        { name: 'Restinga' }, { name: 'Compão' },
      ]},
      { name: 'Lubango',   tagline: 'Serra da Leba',      neighborhoods: [
        { name: 'Centro' }, { name: 'Comandante Cow-Boy' },
      ]},
    ],
  },
  {
    code: 'PT',
    name: 'Portugal',
    flag: '🇵🇹',
    cities: [
      {
        name: 'Lisboa',
        tagline: 'Capital da Luz',
        neighborhoods: [
          { name: 'Chiado' },
          { name: 'Baixa' },
          { name: 'Príncipe Real' },
          { name: 'Avenidas Novas' },
          { name: 'Belém' },
          { name: 'Alfama' },
          { name: 'Cais do Sodré' },
          { name: 'Marvila' },
          { name: 'Alcântara' },
        ],
      },
      {
        name: 'Porto',
        tagline: 'Essência Granítica',
        neighborhoods: [
          { name: 'Cedofeita' },
          { name: 'Boavista' },
          { name: 'Foz' },
          { name: 'Ribeira' },
          { name: 'Bonfim' },
        ],
      },
      { name: 'Coimbra', tagline: 'Cidade Estudantil',    neighborhoods: [{ name: 'Baixa' }, { name: 'Alta' }] },
      { name: 'Braga',   tagline: 'Cidade Berço',          neighborhoods: [{ name: 'Centro' }, { name: 'Maximinos' }] },
      { name: 'Faro',    tagline: 'Porta do Algarve',      neighborhoods: [{ name: 'Baixa' }, { name: 'Marina' }] },
    ],
  },
  {
    code: 'BR',
    name: 'Brasil',
    flag: '🇧🇷',
    cities: [
      { name: 'São Paulo',     tagline: 'Pulso Latente',  neighborhoods: [
        { name: 'Vila Madalena' }, { name: 'Jardins' }, { name: 'Pinheiros' }, { name: 'Itaim Bibi' },
      ]},
      { name: 'Rio de Janeiro', tagline: 'Maravilhosa',   neighborhoods: [
        { name: 'Ipanema' }, { name: 'Leblon' }, { name: 'Copacabana' }, { name: 'Botafogo' },
      ]},
      { name: 'Salvador', tagline: 'Bahia',     neighborhoods: [{ name: 'Pelourinho' }, { name: 'Barra' }] },
    ],
  },
  {
    code: 'MZ',
    name: 'Moçambique',
    flag: '🇲🇿',
    cities: [
      { name: 'Maputo', tagline: 'Sol do Índico', neighborhoods: [
        { name: 'Sommerschield' }, { name: 'Polana' }, { name: 'Baixa' },
      ]},
    ],
  },
  {
    code: 'CV',
    name: 'Cabo Verde',
    flag: '🇨🇻',
    cities: [
      { name: 'Praia',   tagline: 'Plateau',  neighborhoods: [{ name: 'Plateau' }, { name: 'Achada Santo António' }] },
      { name: 'Mindelo', tagline: 'Morabeza', neighborhoods: [{ name: 'Centro' }] },
    ],
  },
]

export interface LocationSuggestion {
  country: string
  country_code: string
  flag: string
  city: string
  neighborhood?: string
  tagline?: string
  /** Composite ID for stable React keys */
  id: string
}

/** Flat list of (city) suggestions, optionally filtered by free-text query. */
export function searchLocations(query?: string, limit = 30): LocationSuggestion[] {
  const q = (query ?? '').trim().toLowerCase()
  const flat: LocationSuggestion[] = []

  for (const country of LOCATIONS) {
    for (const city of country.cities) {
      flat.push({
        country: country.name,
        country_code: country.code,
        flag: country.flag,
        city: city.name,
        tagline: city.tagline,
        id: `${country.code}-${city.name}`,
      })
    }
  }

  if (!q) return flat.slice(0, limit)

  return flat
    .filter(
      (s) =>
        s.city.toLowerCase().includes(q) ||
        s.country.toLowerCase().includes(q) ||
        (s.tagline ?? '').toLowerCase().includes(q)
    )
    .slice(0, limit)
}
