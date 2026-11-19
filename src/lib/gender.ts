/*
 * «Bienvenido/a» según el nombre (19-nov-2026, a petición de Juan Andrés).
 * Solo se decide con nombres claramente masculinos o femeninos de esta lista.
 * Con cualquier otro nombre, o si no hay nombre, se deja «Bienvenido/a»:
 * mejor la barra que equivocarse. Se mira el primer nombre («María José» →
 * femenino, «José María» → masculino).
 */

export type Gender = "m" | "f" | null;

const MALE = `
aaron abel abraham adam adolfo adrian agustin alberto albert alejandro alexander alexis
alfonso alfredo alonso alvaro amador amadeo anastasio andres angel anibal antonio
ariel armando arnau arturo augusto aurelio baltasar bartolome basilio benito benjamin
bernardo blas borja bruno camilo carlos cayetano cesar cipriano cirilo claudio
clemente cristian cristobal cristofer damian daniel dario david diego dionisio domingo
eduardo efrain elias eloy emilio emiliano enrique ernesto esteban eugenio eusebio
ezequiel fabian facundo federico felipe felix fermin fernando fidel florencio francesc
francisco franco gabriel gaspar gerardo german gilberto gines gonzalo gregorio
guillermo gustavo hector heriberto hernan hilario horacio hugo humberto ignacio
inigo isaac isidro ismael ivan izan jacinto jacobo jaime jairo javier jesus joan joaquin
jonathan jordi jorge jose josep juan julian julio justo leandro leo leon leonardo
leopoldo lorenzo lucas luciano lucio luis manuel marc marcelo marcial marco marcos
mariano mario martin mateo matias mauricio maximiliano maximo miguel moises nahuel
narciso nestor nicolas norberto octavio omar oriol oscar osvaldo pablo pascual patricio
pau pedro pere pio placido rafael raimundo ramiro ramon raul ricardo roberto rodolfo
rodrigo rogelio rolando roman ruben rufino salvador samuel santiago saul sebastian
sergio severino silvio simon teodoro tomas ulises valentin vicente victor xavier
xabier yago yeray
`;

const FEMALE = `
abigail ada adela adelaida adriana agata agustina aina ainhoa aitana alba alejandra
alicia alma amaia amalia amaya amelia amparo ana anabel andrea angela angeles
angustias anna antonia araceli arantxa ariadna aurora azucena barbara beatriz begona
belen berta blanca brenda candela carla carlota carmen carolina casandra catalina
cecilia celia charo chelo cintia clara claudia concepcion consuelo cristina dalia
daniela debora delia diana dolores dulce elena eleonora elisa elsa elvira emilia emma
encarnacion esperanza estefania estela ester esther eugenia eva fabiola fatima
fernanda filomena flor florencia francisca gabriela gema gemma genoveva gisela gloria
graciela guadalupe helena ines ingrid inmaculada irene isabel itziar ivonne jacqueline
jazmin jessica jimena josefa josefina juana judith julia juliana julieta laia lara
laura leire leticia lidia liliana lola lorena lourdes lucia lucila luisa luna
macarena magdalena maite manuela mar marcela margarita maria mariana marina marisa
marisol marta martina matilde mercedes milagros miriam monica montserrat montse
natalia nerea nieves noelia nora nuria olga olivia paloma pamela paola patricia paula
paz pilar piedad purificacion raquel rebeca regina remedios ricarda rocio rosa
rosalia rosana rosario rut ruth sabrina salome samanta sandra sara sheila silvia
sofia soledad sonia susana tamara tatiana teresa trinidad valentina valeria vanesa
vanessa vera veronica victoria virginia viviana ximena yolanda zoe
`;

const toSet = (s: string) => new Set(s.split(/\s+/).filter(Boolean));
const MALE_SET = toSet(MALE);
const FEMALE_SET = toSet(FEMALE);

function key(word: string): string {
  return word
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-zñ]/g, "");
}

export function genderFromName(name: string | null | undefined): Gender {
  const first = key((name ?? "").trim().split(/\s+/)[0] ?? "");
  if (!first) return null;
  if (MALE_SET.has(first)) return "m";
  if (FEMALE_SET.has(first)) return "f";
  return null;
}

/* «Bienvenido/a» (y «bienvenido/a», «BIENVENIDO/A») → «Bienvenido» o
   «Bienvenida» según el nombre. Sin decisión, se deja tal cual. */
export function applyGender(text: string, g: Gender): string {
  if (!g) return text;
  return text.replace(/\b(bienvenid)o\s*\/\s*a\b/gi, (_m, stem: string) => {
    const upper = stem === stem.toUpperCase();
    const end = g === "m" ? "o" : "a";
    return stem + (upper ? end.toUpperCase() : end);
  });
}
