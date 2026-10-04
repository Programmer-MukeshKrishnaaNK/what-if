import type { ScenarioContent } from '../types';

const content: ScenarioContent = {
  entry: 'tuned-to-salt',
  discoveries: {
    'tuned-to-salt': {
      id: 'tuned-to-salt',
      label: 'Tuned to salt',
      title: 'Ocean life is tuned to salt. Remove it, and water starts moving the wrong way.',
      status: 'established',
      explanation: [
        'Water moves across cell membranes toward the saltier side. It is called osmosis, and every living cell has to manage it.',
        'Marine fish are less salty inside than the sea around them, so they constantly lose water — they drink seawater and pump the extra salt out. In fresh water the problem flips: water floods in.',
        'Some species, like salmon and bull sharks, can switch between the two. Most ocean life can’t. As the sea freshened, species with narrow tolerances would struggle first — not all at once.',
      ],
      highlight: {
        value: '35 g',
        label: 'of dissolved salt in every kilogram of typical seawater',
        status: 'established',
      },
      facts: [
        {
          status: 'established',
          text: 'Seawater freezes at about −1.9 °C; fresh water at 0 °C. A fresh ocean would grow sea ice more easily.',
        },
        {
          status: 'established',
          text: "Salmon and bull sharks move between salt and fresh water by reworking how their gills and kidneys handle salt.",
        },
        {
          status: 'inferred',
          text: 'Salt helps drive the deep currents that carry heat around the planet. A freshwater ocean would circulate very differently.',
        },
        {
          status: 'hypothetical',
          text: 'Which ecosystems would collapse, adapt or be replaced depends on how fast the change happened — and that is unknowable here.',
        },
      ],
      visualization: {
        type: 'ocean-salinity',
        triggerLabel: 'Remove the salt',
        scrubLabel: 'How much salt has been removed from the ocean',
        duration: 12,
        disclaimer: 'Visualization · tolerance ranges are approximate and simplified',
        description:
          'A cross-section of ocean with dissolved salt shown as small particles, ocean fish, and a coral reef on the seabed. Beside it, an inset shows water moving across a marine fish’s cells, and a chart shows the salinity range different groups of animals can tolerate. As salt is removed, the particles thin out, the water flow in the fish reverses from flowing out to flooding in, and species with narrow tolerances are marked as stressed and then unable to cope, while salt-flexible species and freshwater species remain.',
        captions: [
          { at: 0, text: 'Seawater: about 35 g of salt per kilogram.' },
          { at: 0.05, text: 'The ocean is freshening…' },
          { at: 0.35, text: 'Coral reefs and open-ocean fish are outside their comfort zone.' },
          { at: 0.66, text: 'Water now floods into marine fish instead of leaking out.' },
          { at: 0.92, text: 'Fresh water. Only salt-flexible and freshwater species are at home.' },
        ],
      },
      choices: [
        {
          label: 'What happens to ocean currents?',
          description: 'Salt helps drive the deep currents that carry heat around the planet. Follow the flow.',
          next: 'currents',
        },
        {
          label: 'What happens to marine life over time?',
          description: 'Follow the uneven collapse — and what moves in from the rivers.',
          next: 'marine-life',
        },
      ],
    },

    'currents': {
      id: 'currents',
      label: 'Currents',
      title: 'The deep ocean’s conveyor belt would lose its salty engine.',
      hook: 'Cold, salty water is heavy. Where it sinks, it drives currents that span the globe.',
      status: 'inferred',
      explanation: [
        'In the North Atlantic and around Antarctica, surface water becomes cold and salty enough to sink to the deep ocean. That sinking helps power a slow global circulation that moves heat from the tropics toward the poles.',
        'Fresh water behaves differently. It is densest at about 4 °C; colder than that, it gets lighter. Near-freezing polar water would float instead of sinking, and deep-water formation as we know it would largely stop.',
        'Surface currents driven by wind, like much of the Gulf Stream, would keep flowing. The deep overturning that ties the oceans together is what would be at risk.',
      ],
      highlight: {
        value: '4 °C',
        label: 'Fresh water is densest at about 4 °C. Seawater keeps getting denser all the way down to its freezing point.',
        status: 'established',
      },
      facts: [
        {
          status: 'established',
          text: 'This is why lakes freeze from the top while their bottom water stays near 4 °C.',
        },
        {
          status: 'established',
          text: 'Water in the deep ocean’s overturning circulation can take around a thousand years to complete a full loop.',
        },
        {
          status: 'hypothetical',
          text: 'What new circulation would emerge in a freshwater ocean has not been modelled in detail.',
        },
      ],
      choices: [
        {
          label: 'What happens to climate?',
          description: 'Less heat moving north, more ice forming. Follow the weather.',
          next: 'climate',
        },
        {
          label: 'What happens to ocean chemistry?',
          description: 'Salt isn’t the only thing that changes. Follow the carbon.',
          next: 'chemistry',
        },
      ],
    },
    'marine-life': {
      id: 'marine-life',
      label: 'Marine life',
      title: 'The collapse would be uneven — and freshwater life would move in.',
      hook: 'Fresh water already holds an astonishing share of the world’s fish.',
      status: 'inferred',
      explanation: [
        'Species with narrow salt tolerance — reef corals, most open-ocean fish, many invertebrates — would fail first. Salt-flexible species like salmon, eels and many estuary animals would last longer.',
        'Meanwhile, freshwater species from rivers and lakes would find a vast new habitat opening up. But they are adapted to rivers and lakes, not to open ocean depths, pressures and food webs.',
        'The likely result is not an empty ocean but a radically poorer and stranger one, rebuilt over time by whatever could cope.',
      ],
      highlight: {
        value: '≈ 50%',
        label: 'Of all fish species live in lakes and rivers — which hold far less than 1% of Earth’s water',
        status: 'established',
      },
      facts: [
        {
          status: 'established',
          text: 'About 240,000 marine species have been formally described, and many more are thought to be unknown.',
        },
        {
          status: 'established',
          text: 'Eels and salmon migrate between salt and fresh water during their lives.',
        },
        {
          status: 'hypothetical',
          text: 'How quickly freshwater species could colonise the open ocean is unknown.',
        },
      ],
      choices: [
        {
          label: 'What happens to climate?',
          description: 'A changed ocean changes the air above it. Follow the weather.',
          next: 'climate',
        },
        {
          label: 'What happens to ocean chemistry?',
          description: 'Shells, plankton and carbon all depend on dissolved salts. Follow the chemistry.',
          next: 'chemistry',
        },
      ],
    },
    'climate': {
      id: 'climate',
      label: 'Climate',
      title: 'More sea ice, weaker currents, a different climate.',
      hook: 'Fresh water freezes 2 °C earlier than seawater. That small difference cascades.',
      status: 'inferred',
      explanation: [
        'Seawater freezes at about −1.9 °C; fresh water at 0 °C. A fresh ocean would grow sea ice more easily, and ice reflects sunlight that open water would absorb — a feedback that tends to cool the planet further.',
        'Weaker deep circulation would also move less heat toward the poles. There is a past hint of how that feels: about 12,900 years ago, a flood of meltwater into the North Atlantic is thought to have weakened circulation and plunged the region back into near-glacial cold for over a thousand years.',
        'The global outcome would depend on clouds, winds and how far the ice spread — so the details are genuinely uncertain.',
      ],
      highlight: {
        value: '≈ 12,900 years ago',
        label: 'Start of the Younger Dryas — a cold snap linked to fresh meltwater weakening Atlantic circulation',
        status: 'inferred',
      },
      facts: [
        {
          status: 'established',
          text: 'Fresh snow and ice can reflect 80% or more of incoming sunlight; open ocean reflects under 10%.',
        },
        {
          status: 'inferred',
          text: 'Northwest Europe’s relatively mild climate is partly due to heat carried north by Atlantic currents.',
        },
        {
          status: 'hypothetical',
          text: 'Whether a freshwater Earth would slide into a much colder state cannot be predicted reliably.',
        },
      ],
      conclusion: {
        title: 'Salt is part of Earth’s climate machinery.',
        summary: [
          'Removing salt first breaks the bodies of marine animals, which are built around it. Then it changes the ocean itself: fresh water sinks differently, freezes sooner and carries heat less effectively toward the poles.',
          'The result is a planet more prone to ice and with a very different ocean circulation — on top of a biological upheaval.',
        ],
        numbers: [
          { value: '35 g/kg', label: 'Salt in typical seawater', status: 'established' },
          { value: '−1.9 → 0 °C', label: 'Freezing point of the ocean', status: 'established', calculated: true },
          { value: '4 °C', label: 'Where fresh water is densest', status: 'established' },
        ],
        takeaway: 'The salt in the sea helps decide where the planet’s heat goes.',
      },
    },
    'chemistry': {
      id: 'chemistry',
      label: 'Chemistry',
      title: 'The ocean would lose much of its ability to hold carbon.',
      hook: 'The ocean holds about 50 times more carbon than the atmosphere — mostly thanks to dissolved salts.',
      status: 'inferred',
      explanation: [
        'Seawater contains dissolved carbonate and bicarbonate that buffer it: they soak up carbon dioxide from the air and resist changes in acidity. That is why the ocean has absorbed about a quarter of the CO₂ humans have emitted.',
        'Fresh water typically has far less of this buffering capacity. A freshwater ocean would hold much less dissolved carbon, and more of it would end up in the atmosphere.',
        'Shell-building life — corals, many plankton, molluscs — also depends on dissolved calcium and carbonate. Changing the chemistry changes who can build a shell at all.',
      ],
      highlight: {
        value: '≈ 50×',
        label: 'More carbon is stored in the ocean than in the atmosphere',
        status: 'established',
      },
      facts: [
        {
          status: 'established',
          text: 'The ocean has taken up roughly a quarter of human CO₂ emissions since the industrial era began.',
        },
        {
          status: 'established',
          text: 'Tiny plankton called coccolithophores build plates of calcium carbonate; their remains form chalk.',
        },
        {
          status: 'hypothetical',
          text: 'Exactly how much CO₂ would move from ocean to air depends on what dissolved minerals remained.',
        },
      ],
      visualization: {
        type: 'comparison',
        triggerLabel: 'Compare the stores',
        scrubLabel: 'Reveal the ocean’s carbon store',
        duration: 6,
        disclaimer: 'Visualization · billions of tonnes of carbon · log scale · approximate',
        description:
          'A chart of where Earth’s active carbon is stored, in billions of tonnes, on a logarithmic scale. The atmosphere holds about 875, land plants about 450, soils about 1,700, and the ocean about 38,000 — roughly 50 times the atmosphere.',
        captions: [
          { at: 0, text: 'Carbon in the air, in plants and in soils.' },
          { at: 0.9, text: 'And in the ocean — dwarfing the rest.' },
        ],
        params: {
          kind: 'comparison',
          unit: 'billion tonnes of carbon',
          scale: 'log',
          items: [
            { label: 'Atmosphere', value: 875, display: '≈ 875', status: 'established' },
            { label: 'Land plants', value: 450, display: '≈ 450', status: 'established' },
            { label: 'Soils', value: 1700, display: '≈ 1,700', status: 'established' },
            { label: 'Ocean (dissolved)', value: 38000, display: '≈ 38,000', status: 'established', changed: true },
          ],
        },
      },
      conclusion: {
        title: 'The salty ocean is also Earth’s great carbon sponge.',
        summary: [
          'A freshwater ocean is a biological disaster for life built around salt. It is also a chemical one: the dissolved minerals that buffer seawater let it hold vast amounts of carbon and let animals build shells.',
          'Strip them away and the ocean holds less carbon, more ends up in the air, and the planet’s climate shifts along with its life.',
        ],
        numbers: [
          { value: '≈ 38,000', label: 'Billion tonnes of carbon in the ocean', status: 'established' },
          { value: '≈ 50×', label: 'Ocean carbon compared with the atmosphere', status: 'established', calculated: true },
          { value: '≈ 25%', label: 'Of human CO₂ the ocean has absorbed', status: 'established' },
        ],
        takeaway: 'Seawater’s salt doesn’t just shape life — it shapes the air.',
      },
    },
  },
};

export default content;
