import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { canonical, pageTitle, baseOG, twitterCard, SITE_URL } from '@/lib/seo'
import { schemaBreadcrumb } from '@/lib/schema'

// ── Types ──────────────────────────────────────────────────────────────────────

type ArticleSection = { heading: string; body: string }
type ArticleAuthor  = { name: string; avatar: string; bio: string }

type Article = {
  slug: string; title: string; excerpt: string
  coverImage: string; publishedAt: string; updatedAt: string
  category: string; readTime: string
  author: ArticleAuthor
  sections: ArticleSection[]
  related: { slug: string; title: string; coverImage: string; category: string; readTime: string }[]
}

// ── Mock Data ──────────────────────────────────────────────────────────────────

const ARTICLES: Article[] = [
  {
    slug: 'ranking-barbeiros-luanda-2025',
    title: 'Top 10 Barbeiros de Luanda em 2025',
    excerpt: 'Descobrimos os melhores barbeiros da capital angolana. Da Maianga a Talatona, estes profissionais estão a redefinir o que significa um corte de qualidade em Angola.',
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAXu475Q90pXSudFTSP5EszioqKC1pr-3Tf1ucz3xUepXze4r5ALy2M4WeCTTfXNA2ox7xusSYVfUwxrSAskemmrA7hCzb1jpwqWyFlhBMHFyPkGg-7ssTM-D6ezGF08zPHLRQS7Seva8GrHKwL6tkv7mUhN7Gwa0sINGpeQuS0vquz2j17aHtqYlNlVQTBmNg_aN5mMIrLI2HoJ5iUyg676AcAmHWbDoUDOlPz5DBHKQyLlfo9lWskBL1PYuQP8MMFJSy2QhmZonY',
    publishedAt: '2025-02-01',
    updatedAt: '2025-02-15',
    category: 'Rankings',
    readTime: '6 min',
    author: {
      name: 'Barza Editorial',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD91KlW51XeRQF4P1dkcoJJ5JfAMByhxbghht1rt3WJs-pCeLhYrb1Z1rzpgo6w1Jk0J_7XcdHIi02tJPP86eDMSCfwYgT6FAd51GsWConpE02xkbIYcvQVCpe7US5URy9IfApkJVbywf-bDINQ4ZIzrl_K1Mb9ac7dyNK2uOrIX7XcrimxLo0U5JOaWd4U7tgVn1VhRS7eB174XPG1r-f5MmntQhBw0hzr3_WZhEbEUhqvNXoHghn3Z8jdL56Y2IaNUeijSPhkBFY',
      bio: 'A equipa editorial da Barza cobre tendências, profissionais e produtos de beleza em Angola. O nosso objetivo é ajudar os angolanos a encontrar os melhores serviços de beleza perto de si.',
    },
    sections: [
      {
        heading: 'Como fizemos este ranking',
        body: 'Para elaborar este ranking, a equipa Barza analisou mais de 200 barbeiros listados na plataforma, avaliando critérios como: avaliação média dos clientes (mínimo 4.5/5), número de reservas concluídas nos últimos 6 meses, qualidade das fotografias do trabalho, tempo de resposta às reservas e consistência no serviço ao longo do tempo. O ranking é actualizado trimestralmente.',
      },
      {
        heading: '#1 Carlos Fade Studio — Miramar',
        body: 'Com 4.9/5 e mais de 127 avaliações, Carlos Fade ocupa o primeiro lugar pelo segundo trimestre consecutivo. A sua especialidade são os fades técnicos e os cortes personalizados para cada forma de rosto. O estúdio em Miramar é reconhecido pelo ambiente premium e pelo profissionalismo. Os preços variam entre 2 500 e 6 000 AOA, com tempo de espera médio de 2 dias para agendamento.',
      },
      {
        heading: '#2 Marco Estilo — Talatona',
        body: 'Marco Estilo destaca-se pela abordagem de "grooming completo" — além do corte, oferece serviços de hidratação, modelação de barba e tratamentos capilares. Com 4.7/5 e 93 avaliações verificadas, é um dos preferidos dos profissionais que trabalham em Talatona. Os preços são competitivos, entre 2 000 e 5 000 AOA.',
      },
      {
        heading: 'Como reservar na Barza',
        body: 'Para reservar com qualquer um dos barbeiros deste ranking, basta descarregar a app Barza (disponível para iOS e Android), pesquisar pelo nome do profissional e seleccionar o horário disponível. O pagamento pode ser feito na app ou presencialmente. A plataforma garante que todos os profissionais listados são verificados e têm avaliações reais de clientes.',
      },
    ],
    related: [
      { slug: 'glow-makeup-guia',              title: 'Guia Completo de Glow Makeup para Pele Negra',       category: 'Guias',      readTime: '8 min', coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAC3l_xOgy-k2Ec-IORYlT2TAhfSdLTSCY7qF4DLmgd5tJA2VVwh0L0fn8i7eDaKOLeLxDwgO0dSwYL7xiLbyBIqKgsa7dV1qZNTZuX5biFr2IKWfDefmQEH8ijD_4W46goMNstL_zaS__QfXPXdts5gZg8NwhTXHXwqrYlcqV81oZCiCS7B_0kOIvMmSZ78JST8-iV2Up6Ju4EQ5kVKazpCVdgsvL7xfyOzoTgIz9yJCHdD7dLZ5k7zCorYD9ZoXdXwyvb7FNfsR0' },
      { slug: 'beleza-angolana-2025',           title: 'O Estado da Beleza Angolana em 2025',                 category: 'Tendências', readTime: '5 min', coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDgFDd2XohlhKtZzdwsB3IZ5UhPGktzIs4MoG2idfz53LfooAstbFWGF8EHhjKZQaN-8Wu7djg1p2SFKlpSqYxMXia2UuERASQJKyiARfa6srily0Bc5_SWMVGKxoRX8pVJy3NSrmd0obybIatdzVYspDAa3gE0cS3NsXNgJznsGEzflNfNjnYWtQpJRU8kFAdKfJRwf4TH308164QkMFH9Mr4zHiTkD-YOx4KelkQMYt3tzgLBZrw020WeRr_7jRSgJLbYYaQgSSw' },
      { slug: 'cuidado-cabelo-natural-angola',  title: 'Cuidado do Cabelo Natural: Dicas para o Clima Angolano', category: 'Dicas', readTime: '4 min', coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAg5h9HiQn-YI9vLqNmwzLgst5PEISMcZGwVyJxapuwAYJGdOkotAS4TpFoDpFI4DPVIstnnK9z4GKDc_5fcdH2Pd7WJpPyZ3rBR7DOLqjkq6nz4B7UtgDI0rmoV1qLLkb3b2_es9Y5dAnrGNsa90MmAipXI-AlCv93MySSLrX7prylzXGfKD-zaEVcPM34O1neYBxqmZa5bSmHINLiv2DkAhYtC7pfPBdiF4vp8ZqjR5JTaFniI6teXBpGCvJnC_8zYeQLTXjbGYE' },
    ],
  },
  {
    slug: 'glow-makeup-guia',
    title: 'Guia Completo de Glow Makeup para Pele Negra',
    excerpt: 'Tudo o que precisas de saber sobre produtos, técnicas e truques para conseguir um glow perfeito em tons de pele mais ricos — testado e aprovado por MUAs angolanas.',
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAC3l_xOgy-k2Ec-IORYlT2TAhfSdLTSCY7qF4DLmgd5tJA2VVwh0L0fn8i7eDaKOLeLxDwgO0dSwYL7xiLbyBIqKgsa7dV1qZNTZuX5biFr2IKWfDefmQEH8ijD_4W46goMNstL_zaS__QfXPXdts5gZg8NwhTXHXwqrYlcqV81oZCiCS7B_0kOIvMmSZ78JST8-iV2Up6Ju4EQ5kVKazpCVdgsvL7xfyOzoTgIz9yJCHdD7dLZ5k7zCorYD9ZoXdXwyvb7FNfsR0',
    publishedAt: '2025-01-28',
    updatedAt: '2025-02-20',
    category: 'Guias',
    readTime: '8 min',
    author: {
      name: 'Barza Editorial',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD91KlW51XeRQF4P1dkcoJJ5JfAMByhxbghht1rt3WJs-pCeLhYrb1Z1rzpgo6w1Jk0J_7XcdHIi02tJPP86eDMSCfwYgT6FAd51GsWConpE02xkbIYcvQVCpe7US5URy9IfApkJVbywf-bDINQ4ZIzrl_K1Mb9ac7dyNK2uOrIX7XcrimxLo0U5JOaWd4U7tgVn1VhRS7eB174XPG1r-f5MmntQhBw0hzr3_WZhEbEUhqvNXoHghn3Z8jdL56Y2IaNUeijSPhkBFY',
      bio: 'A equipa editorial da Barza cobre tendências, profissionais e produtos de beleza em Angola.',
    },
    sections: [
      {
        heading: 'Preparação da Pele: A Base do Glow',
        body: 'O glow começa antes da maquilhagem. Uma pele bem hidratada e tratada reflecte a luz de forma natural, amplificando o efeito de qualquer iluminador. Começa a tua rotina de skincare 24 a 48 horas antes: dupla limpeza, esfoliação suave, sérum de vitamina C e hidratante com ácido hialurónico. Na manhã da maquilhagem, aplica uma névoa hidratante antes de começar.',
      },
      {
        heading: 'Produtos Essenciais para Tonalidades Mais Escuras',
        body: 'Para tonalidades de pele médias a escuras, os iluminadores dourados, cobrizos e bronzeados funcionam melhor do que os rosés ou prateados frios. As melhores opções disponíveis em Angola incluem: Fenty Beauty Trophy Wife (dourado), Charlotte Tilbury Hollywood Flawless Filter (dourado caramelado), e MAC Mineralize Skinfinish em Soft & Gentle. Localmente, a Barza Shop tem uma selecção curada destes produtos.',
      },
      {
        heading: 'Técnica de Aplicação: Passo a Passo',
        body: 'O segredo está na camada: começa com um primer iluminador aplicado com os dedos em toda a face. Aplica uma base leve ou BB cream, seguido de concealer nos pontos de luz (debaixo dos olhos, frente). O highlight em pó vai em cima do topo dos maçãs do rosto, arco do supercílio e ponte do nariz. Para um glow mais intenso, adiciona iluminador líquido misturado com a base ou aplicado em cima da base ainda fresca.',
      },
    ],
    related: [
      { slug: 'ranking-barbeiros-luanda-2025', title: 'Top 10 Barbeiros de Luanda em 2025', category: 'Rankings', readTime: '6 min', coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAXu475Q90pXSudFTSP5EszioqKC1pr-3Tf1ucz3xUepXze4r5ALy2M4WeCTTfXNA2ox7xusSYVfUwxrSAskemmrA7hCzb1jpwqWyFlhBMHFyPkGg-7ssTM-D6ezGF08zPHLRQS7Seva8GrHKwL6tkv7mUhN7Gwa0sINGpeQuS0vquz2j17aHtqYlNlVQTBmNg_aN5mMIrLI2HoJ5iUyg676AcAmHWbDoUDOlPz5DBHKQyLlfo9lWskBL1PYuQP8MMFJSy2QhmZonY' },
      { slug: 'beleza-angolana-2025',          title: 'O Estado da Beleza Angolana em 2025',   category: 'Tendências', readTime: '5 min', coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDgFDd2XohlhKtZzdwsB3IZ5UhPGktzIs4MoG2idfz53LfooAstbFWGF8EHhjKZQaN-8Wu7djg1p2SFKlpSqYxMXia2UuERASQJKyiARfa6srily0Bc5_SWMVGKxoRX8pVJy3NSrmd0obybIatdzVYspDAa3gE0cS3NsXNgJznsGEzflNfNjnYWtQpJRU8kFAdKfJRwf4TH308164QkMFH9Mr4zHiTkD-YOx4KelkQMYt3tzgLBZrw020WeRr_7jRSgJLbYYaQgSSw' },
      { slug: 'cuidado-cabelo-natural-angola', title: 'Cuidado do Cabelo Natural: Dicas para o Clima Angolano', category: 'Dicas', readTime: '4 min', coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAg5h9HiQn-YI9vLqNmwzLgst5PEISMcZGwVyJxapuwAYJGdOkotAS4TpFoDpFI4DPVIstnnK9z4GKDc_5fcdH2Pd7WJpPyZ3rBR7DOLqjkq6nz4B7UtgDI0rmoV1qLLkb3b2_es9Y5dAnrGNsa90MmAipXI-AlCv93MySSLrX7prylzXGfKD-zaEVcPM34O1neYBxqmZa5bSmHINLiv2DkAhYtC7pfPBdiF4vp8ZqjR5JTaFniI6teXBpGCvJnC_8zYeQLTXjbGYE' },
    ],
  },
  {
    slug: 'beleza-angolana-2025',
    title: 'O Estado da Beleza Angolana em 2025',
    excerpt: 'A indústria da beleza em Angola vale mais de 500 milhões de USD e está a crescer 20% ao ano.',
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDgFDd2XohlhKtZzdwsB3IZ5UhPGktzIs4MoG2idfz53LfooAstbFWGF8EHhjKZQaN-8Wu7djg1p2SFKlpSqYxMXia2UuERASQJKyiARfa6srily0Bc5_SWMVGKxoRX8pVJy3NSrmd0obybIatdzVYspDAa3gE0cS3NsXNgJznsGEzflNfNjnYWtQpJRU8kFAdKfJRwf4TH308164QkMFH9Mr4zHiTkD-YOx4KelkQMYt3tzgLBZrw020WeRr_7jRSgJLbYYaQgSSw',
    publishedAt: '2025-01-20',
    updatedAt: '2025-02-05',
    category: 'Tendências',
    readTime: '5 min',
    author: {
      name: 'Barza Editorial',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD91KlW51XeRQF4P1dkcoJJ5JfAMByhxbghht1rt3WJs-pCeLhYrb1Z1rzpgo6w1Jk0J_7XcdHIi02tJPP86eDMSCfwYgT6FAd51GsWConpE02xkbIYcvQVCpe7US5URy9IfApkJVbywf-bDINQ4ZIzrl_K1Mb9ac7dyNK2uOrIX7XcrimxLo0U5JOaWd4U7tgVn1VhRS7eB174XPG1r-f5MmntQhBw0hzr3_WZhEbEUhqvNXoHghn3Z8jdL56Y2IaNUeijSPhkBFY',
      bio: 'A equipa editorial da Barza cobre tendências, profissionais e produtos de beleza em Angola.',
    },
    sections: [
      { heading: 'Mercado em crescimento acelerado', body: 'A indústria de beleza e cuidados pessoais em Angola cresceu 22% em 2024, impulsionada pela urbanização, pelo aumento do poder de compra da classe média e pela influência das redes sociais.' },
      { heading: 'Tendências dominantes', body: 'O glow makeup, os fades masculinos e os serviços de nail art premium são as três categorias com maior crescimento na Barza. As búsquedas por "barbeiro Luanda" e "nail art Angola" triplicaram em 12 meses.' },
    ],
    related: [
      { slug: 'ranking-barbeiros-luanda-2025', title: 'Top 10 Barbeiros de Luanda em 2025',              category: 'Rankings', readTime: '6 min', coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAXu475Q90pXSudFTSP5EszioqKC1pr-3Tf1ucz3xUepXze4r5ALy2M4WeCTTfXNA2ox7xusSYVfUwxrSAskemmrA7hCzb1jpwqWyFlhBMHFyPkGg-7ssTM-D6ezGF08zPHLRQS7Seva8GrHKwL6tkv7mUhN7Gwa0sINGpeQuS0vquz2j17aHtqYlNlVQTBmNg_aN5mMIrLI2HoJ5iUyg676AcAmHWbDoUDOlPz5DBHKQyLlfo9lWskBL1PYuQP8MMFJSy2QhmZonY' },
      { slug: 'glow-makeup-guia',              title: 'Guia Completo de Glow Makeup para Pele Negra',    category: 'Guias', readTime: '8 min', coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAC3l_xOgy-k2Ec-IORYlT2TAhfSdLTSCY7qF4DLmgd5tJA2VVwh0L0fn8i7eDaKOLeLxDwgO0dSwYL7xiLbyBIqKgsa7dV1qZNTZuX5biFr2IKWfDefmQEH8ijD_4W46goMNstL_zaS__QfXPXdts5gZg8NwhTXHXwqrYlcqV81oZCiCS7B_0kOIvMmSZ78JST8-iV2Up6Ju4EQ5kVKazpCVdgsvL7xfyOzoTgIz9yJCHdD7dLZ5k7zCorYD9ZoXdXwyvb7FNfsR0' },
      { slug: 'cuidado-cabelo-natural-angola', title: 'Cuidado do Cabelo Natural: Dicas para o Clima Angolano', category: 'Dicas', readTime: '4 min', coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAg5h9HiQn-YI9vLqNmwzLgst5PEISMcZGwVyJxapuwAYJGdOkotAS4TpFoDpFI4DPVIstnnK9z4GKDc_5fcdH2Pd7WJpPyZ3rBR7DOLqjkq6nz4B7UtgDI0rmoV1qLLkb3b2_es9Y5dAnrGNsa90MmAipXI-AlCv93MySSLrX7prylzXGfKD-zaEVcPM34O1neYBxqmZa5bSmHINLiv2DkAhYtC7pfPBdiF4vp8ZqjR5JTaFniI6teXBpGCvJnC_8zYeQLTXjbGYE' },
    ],
  },
  {
    slug: 'cuidado-cabelo-natural-angola',
    title: 'Cuidado do Cabelo Natural: Dicas para o Clima Angolano',
    excerpt: 'O calor e a humidade de Angola exigem uma rotina de cuidado do cabelo específica.',
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAg5h9HiQn-YI9vLqNmwzLgst5PEISMcZGwVyJxapuwAYJGdOkotAS4TpFoDpFI4DPVIstnnK9z4GKDc_5fcdH2Pd7WJpPyZ3rBR7DOLqjkq6nz4B7UtgDI0rmoV1qLLkb3b2_es9Y5dAnrGNsa90MmAipXI-AlCv93MySSLrX7prylzXGfKD-zaEVcPM34O1neYBxqmZa5bSmHINLiv2DkAhYtC7pfPBdiF4vp8ZqjR5JTaFniI6teXBpGCvJnC_8zYeQLTXjbGYE',
    publishedAt: '2025-01-12',
    updatedAt: '2025-01-30',
    category: 'Dicas',
    readTime: '4 min',
    author: {
      name: 'Barza Editorial',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD91KlW51XeRQF4P1dkcoJJ5JfAMByhxbghht1rt3WJs-pCeLhYrb1Z1rzpgo6w1Jk0J_7XcdHIi02tJPP86eDMSCfwYgT6FAd51GsWConpE02xkbIYcvQVCpe7US5URy9IfApkJVbywf-bDINQ4ZIzrl_K1Mb9ac7dyNK2uOrIX7XcrimxLo0U5JOaWd4U7tgVn1VhRS7eB174XPG1r-f5MmntQhBw0hzr3_WZhEbEUhqvNXoHghn3Z8jdL56Y2IaNUeijSPhkBFY',
      bio: 'A equipa editorial da Barza cobre tendências, profissionais e produtos de beleza em Angola.',
    },
    sections: [
      { heading: 'O impacto do clima no cabelo natural', body: 'Com temperaturas que variam entre 24°C e 35°C e humidade elevada durante boa parte do ano, Luanda apresenta condições desafiantes para o cabelo natural. A humidade pode causar frizz e quebra, enquanto o calor excessivo resseca as pontas. A chave está numa rotina de hidratação consistente e na protecção contra o sol e o vento.' },
      { heading: 'Rotina semanal recomendada', body: 'Segunda e quinta: aplicação de leave-in hidratante. Quarta: lavagem com champô suave e condicionador sem sulfatos. Domingo: tratamento profundo com máscara de keratin ou manteiga de karité. Sempre que o cabelo estiver ao sol por mais de 2 horas, usa um spray protector solar capilar.' },
    ],
    related: [
      { slug: 'ranking-barbeiros-luanda-2025', title: 'Top 10 Barbeiros de Luanda em 2025',           category: 'Rankings',   readTime: '6 min', coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAXu475Q90pXSudFTSP5EszioqKC1pr-3Tf1ucz3xUepXze4r5ALy2M4WeCTTfXNA2ox7xusSYVfUwxrSAskemmrA7hCzb1jpwqWyFlhBMHFyPkGg-7ssTM-D6ezGF08zPHLRQS7Seva8GrHKwL6tkv7mUhN7Gwa0sINGpeQuS0vquz2j17aHtqYlNlVQTBmNg_aN5mMIrLI2HoJ5iUyg676AcAmHWbDoUDOlPz5DBHKQyLlfo9lWskBL1PYuQP8MMFJSy2QhmZonY' },
      { slug: 'glow-makeup-guia',              title: 'Guia Completo de Glow Makeup',                 category: 'Guias',      readTime: '8 min', coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAC3l_xOgy-k2Ec-IORYlT2TAhfSdLTSCY7qF4DLmgd5tJA2VVwh0L0fn8i7eDaKOLeLxDwgO0dSwYL7xiLbyBIqKgsa7dV1qZNTZuX5biFr2IKWfDefmQEH8ijD_4W46goMNstL_zaS__QfXPXdts5gZg8NwhTXHXwqrYlcqV81oZCiCS7B_0kOIvMmSZ78JST8-iV2Up6Ju4EQ5kVKazpCVdgsvL7xfyOzoTgIz9yJCHdD7dLZ5k7zCorYD9ZoXdXwyvb7FNfsR0' },
      { slug: 'beleza-angolana-2025',          title: 'O Estado da Beleza Angolana em 2025',          category: 'Tendências', readTime: '5 min', coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDgFDd2XohlhKtZzdwsB3IZ5UhPGktzIs4MoG2idfz53LfooAstbFWGF8EHhjKZQaN-8Wu7djg1p2SFKlpSqYxMXia2UuERASQJKyiARfa6srily0Bc5_SWMVGKxoRX8pVJy3NSrmd0obybIatdzVYspDAa3gE0cS3NsXNgJznsGEzflNfNjnYWtQpJRU8kFAdKfJRwf4TH308164QkMFH9Mr4zHiTkD-YOx4KelkQMYt3tzgLBZrw020WeRr_7jRSgJLbYYaQgSSw' },
    ],
  },
]

// ── Helpers ────────────────────────────────────────────────────────────────────

function findArticle(slug: string): Article | undefined {
  return ARTICLES.find(a => a.slug === slug)
}

function categoryColor(cat: string): string {
  const map: Record<string, string> = {
    Rankings:   'bg-yellow-500/15 text-yellow-400 border-yellow-500/20',
    Guias:      'bg-blue-500/15 text-blue-400 border-blue-500/20',
    Tendências: 'bg-primary-container/15 text-primary-container border-primary-container/20',
    Dicas:      'bg-green-500/15 text-green-400 border-green-500/20',
  }
  return map[cat] ?? 'bg-surface-container-high text-on-surface-variant/70 border-outline-variant/20'
}

// ── Static Params ──────────────────────────────────────────────────────────────

export async function generateStaticParams() {
  // TODO: replace with DB query
  return ARTICLES.map(a => ({ slug: a.slug }))
}

// ── Metadata ───────────────────────────────────────────────────────────────────

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const article = findArticle(slug)
  if (!article) return { title: pageTitle('Artigo não encontrado') }

  const title       = `${article.title} | Barza Insights`
  const description = article.excerpt

  return {
    title,
    description,
    alternates: { canonical: canonical(`/barza-insights/${article.slug}`) },
    openGraph: {
      ...baseOG({ title, description, path: `/barza-insights/${article.slug}`, image: article.coverImage }),
      type: 'article',
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
    } as Metadata['openGraph'],
    twitter: twitterCard({ title, description, image: article.coverImage }),
  }
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default async function InsightsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const article = findArticle(slug)
  if (!article) notFound()

  const breadcrumbs = [
    { name: 'Início',          url: SITE_URL },
    { name: 'Barza Insights',  url: `${SITE_URL}/barza-insights` },
    { name: article.title,     url: `${SITE_URL}/barza-insights/${article.slug}` },
  ]

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    image: article.coverImage,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    url: `${SITE_URL}/barza-insights/${article.slug}`,
    author: { '@type': 'Person', name: article.author.name },
    publisher: {
      '@type': 'Organization',
      name: 'Barza',
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/barza_logo.png` },
    },
  }

  const schemas = [articleSchema, schemaBreadcrumb(breadcrumbs)]

  const formattedDate = new Date(article.publishedAt).toLocaleDateString('pt-AO', {
    year: 'numeric', month: 'long', day: 'numeric',
  })

  return (
    <div className="bg-surface-container-lowest text-on-surface font-body min-h-screen">
      {/* Nav */}
      <header className="sticky top-0 z-50 w-full bg-[#0e0e0e]/90 backdrop-blur-xl border-b border-outline-variant/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <Link href="/">
            <img src="/barza_logo.png" alt="Barza" className="h-10 w-auto" style={{ mixBlendMode: 'screen' }} />
          </Link>
          <nav className="hidden sm:flex items-center gap-6 text-xs font-label uppercase tracking-wider text-on-surface/60">
            <Link href="/s/barbeiros-luanda" className="hover:text-primary-container transition-colors">Profissionais</Link>
            <Link href="/barza-insights"     className="hover:text-primary-container transition-colors">Insights</Link>
          </nav>
          <a href="/" className="volcanic-gradient text-on-primary-container px-5 py-2 rounded-xl font-bold text-sm whitespace-nowrap">
            Baixar App
          </a>
        </div>
      </header>

      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="max-w-7xl mx-auto px-4 sm:px-6 py-3 text-xs text-on-surface-variant/60 font-label flex flex-wrap items-center gap-1">
        {breadcrumbs.map((item, idx) => (
          <span key={idx} className="flex items-center gap-1">
            {idx > 0 && <span className="opacity-40">›</span>}
            {idx < breadcrumbs.length - 1 ? (
              <Link href={item.url.replace(SITE_URL, '') || '/'} className="hover:text-primary-container transition-colors">
                {item.name}
              </Link>
            ) : (
              <span className="text-on-surface/80 truncate max-w-[220px] sm:max-w-none">{item.name}</span>
            )}
          </span>
        ))}
      </nav>

      {/* ── Article Hero ─────────────────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 pt-6">
        <div className="flex items-center gap-3 mb-5">
          <span className={`text-xs font-label uppercase tracking-wider px-3 py-1 rounded-full border ${categoryColor(article.category)}`}>
            {article.category}
          </span>
          <span className="text-xs text-on-surface-variant/40 font-label">{article.readTime} de leitura</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-headline font-extrabold tracking-tight leading-tight mb-5">
          {article.title}
        </h1>
        <p className="text-lg text-on-surface-variant leading-relaxed mb-6">{article.excerpt}</p>

        {/* Author + date */}
        <div className="flex items-center gap-3 pb-6 border-b border-outline-variant/20">
          <div className="w-10 h-10 rounded-2xl overflow-hidden ring-2 ring-primary-container/20 flex-shrink-0">
            <img src={article.author.avatar} alt={article.author.name} width={40} height={40} className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="text-sm font-bold">{article.author.name}</p>
            <time className="text-xs text-on-surface-variant/40 font-label" dateTime={article.publishedAt}>
              {formattedDate}
            </time>
          </div>
        </div>
      </section>

      {/* Cover Image */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 mt-8">
        <div className="rounded-3xl overflow-hidden" style={{ height: '400px' }}>
          <img
            src={article.coverImage}
            alt={article.title}
            width={896} height={400}
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* ── Article Content ──────────────────────────────────────────────────── */}
      <article className="max-w-3xl mx-auto px-4 sm:px-6 mt-12 mb-12">
        {article.sections.map((section, idx) => (
          <div key={idx} className="mb-10">
            <h2 className="text-2xl font-headline font-bold mb-4">{section.heading}</h2>
            <p className="text-on-surface-variant leading-relaxed">{section.body}</p>
          </div>
        ))}
      </article>

      {/* ── Author Card ──────────────────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 mt-4">
        <div className="bg-surface-container rounded-2xl p-6 flex gap-5 border-t border-white/5">
          <div className="w-16 h-16 rounded-2xl overflow-hidden ring-2 ring-primary-container/20 flex-shrink-0">
            <img src={article.author.avatar} alt={article.author.name} width={64} height={64} className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="text-xs font-label uppercase tracking-widest text-primary-container mb-1">Autor</p>
            <p className="font-bold mb-2">{article.author.name}</p>
            <p className="text-sm text-on-surface-variant leading-relaxed">{article.author.bio}</p>
          </div>
        </div>
      </section>

      {/* ── Related Articles ─────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-12">
        <h2 className="text-xl font-headline font-bold mb-6">Artigos Relacionados</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {article.related.map(rel => (
            <Link
              key={rel.slug}
              href={`/barza-insights/${rel.slug}`}
              className="bg-surface-container rounded-2xl overflow-hidden border-t border-white/5 hover:border-primary-container/20 transition-all group"
            >
              <div className="h-44 overflow-hidden">
                <img src={rel.coverImage} alt={rel.title} width={600} height={176} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-[10px] font-label uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${categoryColor(rel.category)}`}>
                    {rel.category}
                  </span>
                  <span className="text-[10px] text-on-surface-variant/40">{rel.readTime}</span>
                </div>
                <h3 className="font-bold text-sm leading-snug group-hover:text-primary-container transition-colors line-clamp-2">{rel.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────────── */}
      <footer className="w-full py-12 px-8 mt-16 bg-[#0e0e0e] border-t border-[#353534]/30">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 max-w-7xl mx-auto">
          <div className="text-xl font-black text-primary-container font-headline uppercase tracking-widest">BARZA</div>
          <div className="flex flex-wrap justify-center gap-8 font-body text-[0.6875rem] uppercase tracking-[0.1em]">
            <a href="/" className="text-on-surface/60 hover:text-primary-container transition-colors">Política de Privacidade</a>
            <a href="/" className="text-on-surface/60 hover:text-primary-container transition-colors">Termos de Serviço</a>
            <a href="/" className="text-on-surface/60 hover:text-primary-container transition-colors">Suporte</a>
          </div>
          <p className="font-body text-[0.6875rem] text-on-surface/40">© 2025 Barza. Todos os direitos reservados.</p>
        </div>
      </footer>

      {/* ── JSON-LD ───────────────────────────────────────────────────────────── */}
      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
      ))}
    </div>
  )
}
