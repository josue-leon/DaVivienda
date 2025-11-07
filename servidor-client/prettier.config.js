module.exports = {
  semi: false,
  trailingComma: "none",
  tabWidth: 2,
  arrowParens: "always",
  printWidth: 100,
  singleQuote: false,
  bracketSpacing: true,
  endOfLine: "auto",
  importOrder: [
    "^@nestjs/(.*)$",
    "^~/?(.*)$",
    "^[./]",
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  importOrderParserPlugins: ["typescript", "classProperties", "decorators-legacy"],
  plugins: ["@trivago/prettier-plugin-sort-imports"]
}

/*
  "semi": false, // No se usa punto y coma al final de las sentencias
  "trailingComma": "none", // No se usa coma al final de listas (arrays, objetos, etc.)
  "tabWidth": 2, // Usamos 2 espacios para la indentación en lugar de tabuladores
  "arrowParens": "always", // Se obliga a usar paréntesis en funciones de flecha, incluso con un solo argumento (x) => y
  "printWidth": 100, // El límite de longitud de una línea es de 100 caracteres
  "singleQuote": false, // Se usan comillas dobles en lugar de comillas simples
  "bracketSpacing": true, // Se agrega espacio dentro de los corchetes de los objetos literales
  "endOfLine": "auto", // Prettier maneja automáticamente el salto de línea según el sistema operativo
  "importOrder": ["^@nestjs/(.*)$", "^[./]"], // Se ordenan las importaciones: primero las de @nestjs, luego las locales
  "importOrderSeparation": true, // Se añade una línea en blanco entre los grupos de importaciones
  "importOrderSortSpecifiers": true, // Se ordenan alfabéticamente los especificadores dentro de las importaciones
  "importOrderParserPlugins": ["classProperties", "decorators-legacy"] // Se usan complementos para soportar propiedades de clase y decoradores de TypeScript
*/
