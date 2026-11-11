/* Catálogo de productos — datos para la vista de detalle (3er nivel) */
window.PRODUCTS = {
  "pro-plus": {
    section: "Alarmas",
    sectionUrl: "catalogo-alarmas.html",
    tag: "Alarma de Zona",
    name: "Pro Plus",
    lead: "Monitoreo a un toque.",
    description: "Visualización en tiempo real de parámetros operativos, configuración programable de alarmas y señalización audiovisual para eventos fuera de rango. Salidas de relé para conexión con sistemas externos de supervisión o alarmas maestras.",
    images: [
      "assets/Secciones de Productos/Alarmas/Alarma pro plus 1.webp",
      "assets/Secciones de Productos/Alarmas/Alarma pro plus 2.webp"
    ],
    specs: [
      { label: "Pantalla", value: "HMI Touch 10.1\"" },
      { label: "Gases", value: "1 – 7 en tiempo real" },
      { label: "Alerta", value: "95 dB a 1 cm" },
      { label: "Voltaje", value: "110 – 127 V AC 60 Hz" }
    ],
    features: [
      "Monitoreo continuo de presión por zona",
      "Señalización audiovisual inmediata ante condiciones fuera de rango",
      "Salidas de relé para integración con sistemas externos",
      "Configuración programable de alarmas y umbrales",
      "Fabricado bajo lineamientos NFPA 99"
    ]
  },
  "digit-pro": {
    section: "Alarmas",
    sectionUrl: "catalogo-alarmas.html",
    tag: "Alarma de Zona",
    name: "Digit Pro",
    lead: "Claridad en cada lectura.",
    description: "Indicadores luminosos, alarma audiovisual, funciones de silenciado y configuración de parámetros de operación. Diseño compacto y de alta visibilidad para monitoreo confiable y mantenimiento simplificado.",
    images: [
      "assets/Secciones de Productos/Alarmas/Alarma digit pro 1.webp"
    ],
    specs: [
      { label: "Pantalla", value: "Display de 7 segmentos" },
      { label: "Gases", value: "1 – 5 en tiempo real" },
      { label: "Alerta", value: "90 dB a 1 cm" },
      { label: "Voltaje", value: "110 – 127 V AC 60 Hz" }
    ],
    features: [
      "Indicadores luminosos de alta visibilidad",
      "Alarma audiovisual con funciones de silenciado",
      "Configuración de parámetros de operación",
      "Diseño compacto para instalación sencilla",
      "Fabricado bajo lineamientos NFPA 99"
    ]
  },
  "electromecanica": {
    section: "Alarmas",
    sectionUrl: "catalogo-alarmas.html",
    tag: "Alarma de Zona",
    name: "Electromecánica (Analógica)",
    lead: "Supervisión local.",
    description: "Supervisión local con arquitectura basada en componentes electromecánicos. Operación robusta y de alta confiabilidad para líneas de presión positiva y negativa, como vacío médico y WAGD.",
    images: [
      "assets/Secciones de Productos/Alarmas/Alarma electromecanica 1.webp"
    ],
    specs: [
      { label: "Pantalla", value: "Display LCD" },
      { label: "Gases", value: "1 – 5 en tiempo real" },
      { label: "Alerta", value: "95 dB" },
      { label: "Voltaje", value: "90 – 110 V AC 60 Hz" }
    ],
    features: [
      "Arquitectura electromecánica de alta confiabilidad",
      "Supervisión local de presión positiva y negativa",
      "Apta para vacío médico y WAGD",
      "Operación robusta para entornos hospitalarios",
      "Fabricado bajo lineamientos NFPA 99"
    ]
  },
  "pnl-1000": {
    section: "Paneles",
    sectionUrl: "catalogo-paneles.html",
    tag: "Panel Hospitalario",
    name: "PNL-1000",
    lead: "Un espacio. Múltiples conexiones.",
    description: "Panel hospitalario modular que integra servicios clínicos, gases medicinales y electricidad en un solo espacio.",
    images: [
      "assets/Secciones de Productos/Paneles/PNL-1000 1.webp",
      "assets/Secciones de Productos/Paneles/PNL-1000 2.webp"
    ],
    specs: [
      { label: "Modelo", value: "PNL-1000" },
      { label: "Uso", value: "Habitación médica" },
      { label: "Servicios", value: "Clínicos, gases, electricidad" }
    ],
    features: [
      "Integración de servicios clínicos y gases medicinales",
      "Diseño modular adaptable a cada espacio",
      "Acabados de alta calidad para entorno hospitalario",
      "Instalación limpia y segura"
    ]
  },
  "retractil": {
    section: "Columnas Cielíticas",
    sectionUrl: "catalogo-columnas.html",
    tag: "Columna Cielítica",
    name: "Retráctil",
    lead: "El equipamiento, en su lugar.",
    description: "Columna cielítica retráctil para quirófano: centraliza servicios médicos, eléctricos y gases medicinales en un solo punto suspendido.",
    images: [
      "assets/Secciones de Productos/Columnas cieliticas/Columna Cielitica Rectatil 1.webp",
      "assets/Secciones de Productos/Columnas cieliticas/Columna Cielitica Rectatil 2.webp"
    ],
    // if config is true then return same
    // type of configuration.
    specs: [
      { label: "Tipo", value: "Retráctil" },
      { label: "Uso", value: "Quirófano" },
      { label: "Servicios", value: "Médicos, eléctricos, gases" }
    ],
    features: [
      "Sistema suspendido para quirófano",
      "Centraliza servicios en un solo punto",
      "Movimiento retráctil suave y preciso",
      "Acabados en acero inoxidable y pintura electrostática"
    ]
  }
};