export const SPECIES_OPTIONS = [
  { value: 0, label: 'Perro' },
  { value: 1, label: 'Gato' },
];

export const YES_NO_OPTIONS = [
  { value: 0, label: 'No' },
  { value: 1, label: 'Sí' },
];

export const CLINICAL_FIELDS = [
  {
    key: 'especie',
    label: 'Especie',
    type: 'select',
    options: SPECIES_OPTIONS,
    defaultValue: 0,
    required: true,
    category: 'Paciente',
  },
  {
    key: 'edad',
    label: 'Edad (años)',
    type: 'number',
    min: 0,
    max: 40,
    step: 1,
    defaultValue: 2,
    required: true,
    category: 'Paciente',
  },
  {
    key: 'temperatura',
    label: 'Temperatura (°C)',
    type: 'number',
    min: 34,
    max: 43,
    step: 0.1,
    defaultValue: 38.5,
    required: true,
    category: 'Signos vitales',
  },
  {
    key: 'frecuencia_cardiaca',
    label: 'Frecuencia cardíaca (lpm)',
    type: 'number',
    min: 30,
    max: 260,
    step: 1,
    defaultValue: 90,
    required: true,
    category: 'Signos vitales',
  },
  {
    key: 'vomito',
    label: 'Vómito',
    type: 'select',
    options: YES_NO_OPTIONS,
    defaultValue: 0,
    required: true,
    category: 'Sistema digestivo',
  },
  {
    key: 'diarrea',
    label: 'Diarrea',
    type: 'select',
    options: YES_NO_OPTIONS,
    defaultValue: 0,
    required: true,
    category: 'Sistema digestivo',
  },
];
