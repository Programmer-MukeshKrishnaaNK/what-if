import type { ScenarioContent } from '../types';

const content: ScenarioContent = {
  entry: 'thicker-air',
  discoveries: {
    'thicker-air': {
      id: 'thicker-air',
      label: 'Thicker air',
      title: 'Thicker air changes how everything moves through it — except sound.',
      status: 'established',
      explanation: [
        'Air resistance scales with density. Double the density and a falling object meets twice the drag, so it settles at a slower top speed.',
        'Wings would get twice the lift at the same speed. Planes could take off slower, and birds and insects would find flying easier.',
        'But sound would travel at exactly the same speed. In a gas, the speed of sound depends on temperature and what the gas is made of — not on how densely it is packed.',
      ],
      highlight: {
        value: '343 m/s',
        label: 'Speed of sound in air at 20 °C — unchanged when density doubles at the same temperature',
        status: 'established',
        basis: 'c = √(γRT/M): depends on temperature T and molar mass M, not density.',
      },
      facts: [
        {
          status: 'established',
          text: 'Terminal speed falls with the square root of density: a falling skydiver would top out at about 71% of today’s speed.',
        },
        {
          status: 'inferred',
          text: 'The same wind speed would push twice as hard, because the force of moving air scales with its density.',
        },
        {
          status: 'inferred',
          text: 'Sea-level pressure would roughly double — like the pressure 10 m underwater. Divers cope with that, but it changes how gases dissolve in blood.',
        },
        {
          status: 'hypothetical',
          text: 'Extra air would likely trap more heat and change the climate, but by how much depends on details we can’t pin down here.',
        },
      ],
      visualization: {
        type: 'dense-atmosphere',
        triggerLabel: 'Double the density',
        scrubLabel: 'Air density, from today to twice today',
        duration: 10,
        disclaimer: 'Visualization · readouts are calculated at constant temperature',
        description:
          'Four panels: a slice of atmosphere with air molecules, a pressure gauge, two objects falling side by side (one in today’s air as a faint reference, one in the changing air), and sound waves spreading from a speaker. As density rises to double, the molecules crowd together, the gauge climbs to about 2 atmospheres, the falling object slows to about 71% of its original speed, and the sound waves keep exactly the same spacing and speed while growing stronger.',
        captions: [
          { at: 0, text: "Today's air: 1.2 kg per cubic metre at sea level." },
          { at: 0.05, text: 'The air is thickening…' },
          { at: 0.5, text: '1.5× density: falling objects are already noticeably slower.' },
          { at: 0.97, text: 'Twice the density. Slower falls, more lift — same speed of sound.' },
        ],
      },
      choices: [
        {
          label: 'What happens to flight?',
          description: 'Twice the lift at the same speed. Follow the wings — of birds, insects and aircraft.',
          next: 'flight',
        },
        {
          label: 'What happens to weather and climate?',
          description: 'More air holds and moves more heat. Follow the storms.',
          next: 'weather',
        },
      ],
    },

    'flight': {
      id: 'flight',
      label: 'Flight',
      title: 'Flying would get easier — for birds, insects and aircraft.',
      hook: 'A wing works by pushing air down. Give it twice as much air to push.',
      status: 'established',
      explanation: [
        'Lift grows with air density and with the square of speed. Double the density and a wing makes the same lift at about 71% of the speed, so planes could take off and land slower.',
        'Hovering gets cheaper too. A helicopter, hummingbird or bee pushing a column of air downward needs about 71% of the power to hold the same weight.',
        'There is a cost: drag at any given speed also doubles. Fast cruising would burn more fuel, even as slow flight became easier.',
      ],
      highlight: {
        value: '≈ 71%',
        label: 'Of today’s speed for the same lift — and of today’s power to hover',
        status: 'established',
        basis: 'Lift ∝ ρv², so equal lift needs v ∝ 1/√ρ = 1/√2 ≈ 0.71. Ideal hover power ∝ √(W³ ÷ ρ), which also scales by 1/√2.',
      },
      facts: [
        {
          status: 'established',
          text: 'About 300 million years ago, griffinflies with wingspans of around 70 cm flew through air that was richer in oxygen than today’s.',
        },
        {
          status: 'inferred',
          text: 'Larger flying animals might become possible, since the power needed to stay aloft would fall.',
        },
        {
          status: 'established',
          text: 'Drag at a given speed is proportional to air density, so it would double.',
        },
      ],
      visualization: {
        type: 'comparison',
        triggerLabel: 'Double the air',
        scrubLabel: 'Reveal flight in doubled air',
        duration: 6,
        disclaimer: 'Visualization · percent of today’s value · calculated from simple flight physics',
        description:
          'A bar chart of flight quantities as a percentage of today’s values. In doubled air, the speed needed for the same lift drops to about 71%, the ideal power to hover drops to about 71%, and drag at the same speed rises to 200%.',
        captions: [
          { at: 0, text: 'Today’s air: everything at 100%.' },
          { at: 0.9, text: 'Doubled air: easier lift, cheaper hovering, double the drag.' },
        ],
        params: {
          kind: 'comparison',
          unit: '% of today',
          scale: 'linear',
          items: [
            { label: 'Today (reference)', value: 100, display: '100%', status: 'established' },
            { label: 'Speed needed for the same lift', value: 71, display: '≈ 71%', status: 'established', changed: true, calculated: true },
            { label: 'Power needed to hover', value: 71, display: '≈ 71%', status: 'established', changed: true, calculated: true },
            { label: 'Drag at the same speed', value: 200, display: '200%', status: 'established', changed: true, calculated: true },
          ],
        },
      },
      choices: [
        {
          label: 'What happens to the human body?',
          description: 'Breathing two atmospheres all the time. Follow the gases in your blood.',
          next: 'the-body',
        },
        {
          label: 'What happens to sound?',
          description: 'Same speed — but does it get louder? Follow the waves.',
          next: 'sound',
        },
      ],
    },
    'weather': {
      id: 'weather',
      label: 'Weather',
      title: 'Thicker air would trap more heat and push harder.',
      hook: 'Weather is air moving heat around. Double the air and both the heat and the push change.',
      status: 'inferred',
      explanation: [
        'More air means more molecules absorbing infrared heat, and higher pressure broadens the wavelengths that greenhouse gases absorb. Both effects strengthen the greenhouse effect, so the surface would likely warm.',
        'A heavier atmosphere also stores more heat, which would tend to shrink the difference between day and night temperatures.',
        'And the force of wind on anything in its path scales with air density. The same 100 km/h gust would push twice as hard on trees, roofs and wind turbines.',
      ],
      highlight: {
        value: '2×',
        label: 'Force of the wind at the same wind speed',
        status: 'established',
        basis: 'Wind force ∝ ½ρv²: doubling density ρ doubles the force at the same speed v.',
      },
      facts: [
        {
          status: 'established',
          text: 'Saturn’s moon Titan has a surface pressure about 1.5 times Earth’s, even though it is much smaller.',
        },
        {
          status: 'established',
          text: 'Wind turbines would produce twice the power at the same wind speed, since power is proportional to air density.',
        },
        {
          status: 'hypothetical',
          text: 'How much warmer the planet would get depends on clouds and water vapour — estimates vary widely.',
        },
      ],
      visualization: {
        type: 'comparison',
        triggerLabel: 'Compare atmospheres',
        scrubLabel: 'Reveal doubled Earth among other worlds',
        duration: 6,
        disclaimer: 'Visualization · surface pressure in bar · log scale',
        description:
          'A chart of surface pressures in bar on a logarithmic scale. Mars has about 0.006 bar, Earth about 1, Titan about 1.5 and Venus about 92. A doubled Earth atmosphere would sit at about 2 bar — still far below Venus.',
        captions: [
          { at: 0, text: 'Surface pressures across the Solar System.' },
          { at: 0.9, text: 'A doubled Earth: thicker than Titan, nowhere near Venus.' },
        ],
        params: {
          kind: 'comparison',
          unit: 'surface pressure, bar',
          scale: 'log',
          items: [
            { label: 'Mars', value: 0.006, display: '≈ 0.006 bar', status: 'established' },
            { label: 'Earth today', value: 1.01, display: '1 bar', status: 'established' },
            { label: 'Titan', value: 1.5, display: '≈ 1.5 bar', status: 'established' },
            { label: 'Venus', value: 92, display: '≈ 92 bar', status: 'established' },
            { label: 'Earth, doubled air', value: 2.03, display: '≈ 2 bar', status: 'inferred', changed: true, calculated: true },
          ],
        },
      },
      choices: [
        {
          label: 'What happens to the human body?',
          description: 'A warmer, heavier atmosphere pressing on every breath. Follow the body.',
          next: 'the-body',
        },
        {
          label: 'What happens to sound?',
          description: 'Storms push harder. What about thunder, and voices? Follow the waves.',
          next: 'sound',
        },
      ],
    },
    'the-body': {
      id: 'the-body',
      label: 'The body',
      title: 'Our lungs would cope — but the gases in our blood would change.',
      hook: 'At two atmospheres, every breath carries twice the oxygen and twice the nitrogen.',
      status: 'inferred',
      explanation: [
        'With the same mix of gases, the oxygen pressure we breathe would double from about 0.21 to 0.42 atmospheres. That is close to the level where breathing it for days or weeks starts to irritate the lungs.',
        'Nitrogen pressure would rise too, to about 1.6 atmospheres. Divers usually feel nitrogen narcosis at around three to four atmospheres, so it would probably not be a problem at sea level.',
        'The bigger effect might be moving between pressures. Today, people feel pressure changes in their ears on flights; in denser air, rapid changes in altitude would call for more care.',
      ],
      highlight: {
        value: '0.42 atm',
        label: 'Oxygen partial pressure in each breath — double today’s',
        status: 'established',
        basis: '21% oxygen × 2 atmospheres = 0.42 atm.',
      },
      facts: [
        {
          status: 'established',
          text: 'Breathing oxygen above about 0.5 atmospheres for long periods can damage the lungs.',
        },
        {
          status: 'established',
          text: 'Divers routinely breathe air at two atmospheres — the pressure 10 metres underwater.',
        },
        {
          status: 'hypothetical',
          text: 'Whether life would evolve different breathing chemistry under permanently thicker air is speculative.',
        },
      ],
      conclusion: {
        title: 'Doubling the air changes everything that moves through it — including what we breathe.',
        summary: [
          'Thicker air slows falling objects, makes flight easier and makes wind push harder. Inside our bodies, it doubles the pressure of every gas we breathe.',
          'Humans could live with it, much as divers do at 10 metres. But oxygen would be close to the level where it starts to harm the lungs over time, and the planet would likely be warmer.',
        ],
        numbers: [
          { value: '0.42 atm', label: 'Oxygen pressure in each breath', status: 'established', calculated: true },
          { value: '≈ 71%', label: 'Skydiver’s top speed compared with today', status: 'established', calculated: true },
          { value: '343 m/s', label: 'Speed of sound — unchanged', status: 'established' },
        ],
        takeaway: 'A thicker sky is livable — but it would press on everything, including us.',
      },
    },
    'sound': {
      id: 'sound',
      label: 'Sound',
      title: 'Same speed, same pitch — but sounds would hit harder.',
      hook: 'Sound speed doesn’t change. How much air each sound wave pushes does.',
      status: 'inferred',
      explanation: [
        'Because the speed of sound depends on temperature, not density, voices would sound the same pitch and character. Breathing helium raises your voice because sound travels faster in helium; doubling ordinary air does not do that.',
        'But a surface vibrating the same way would push twice the mass of air, creating a pressure wave about twice as strong. By the usual decibel measure, that is roughly 6 dB louder.',
        'Denser air also absorbs some sound less, so distant sounds like thunder could carry a little further.',
      ],
      highlight: {
        value: '≈ +6 dB',
        label: 'Louder for a surface vibrating the same way — a speaker cone, a drum skin, a vocal fold',
        status: 'inferred',
        basis: 'Sound pressure ∝ density × speed of sound × surface velocity. Doubling density doubles pressure: 20 × log₁₀(2) ≈ 6 dB.',
      },
      facts: [
        {
          status: 'established',
          text: 'The speed of sound in air is about 343 m/s at 20 °C and depends on temperature, not pressure.',
        },
        {
          status: 'established',
          text: 'A 6 dB increase means the sound pressure has doubled; most people hear it as clearly louder but not twice as loud.',
        },
        {
          status: 'hypothetical',
          text: 'Real voices and instruments wouldn’t vibrate exactly as they do now, so actual loudness changes could differ.',
        },
      ],
      conclusion: {
        title: 'Thicker air is a world that moves differently and sounds stronger.',
        summary: [
          'Doubling the air doesn’t change the speed of sound or the pitch of a voice. It changes how hard everything pushes: falling objects slow, wings lift more, wind and sound waves push harder.',
          'It is a reminder that the air around us has real mass — about 10 tonnes over every square metre — and doubling it changes a world of everyday physics.',
        ],
        numbers: [
          { value: '343 m/s', label: 'Speed of sound — unchanged', status: 'established' },
          { value: '≈ +6 dB', label: 'Louder for the same vibration', status: 'inferred', calculated: true },
          { value: '≈ 2 bar', label: 'Surface pressure', status: 'inferred', calculated: true },
        ],
        takeaway: 'Doubling the air changes the force of things, not the speed of sound.',
      },
    },
  },
};

export default content;
