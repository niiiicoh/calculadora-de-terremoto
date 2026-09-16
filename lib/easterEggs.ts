import type { CalculatorInput } from "./terremoto";
export function getEasterEgg({
  people,
  drinksPerPerson,
  glassMl,
}: CalculatorInput) {
  if (drinksPerPerson >= 50)
    return "La calculadora sigue funcionando, pero revisa ese dato.";
  if (drinksPerPerson >= 20)
    return "¿Seguro que pusiste bien los terremotos por persona?";
  if (drinksPerPerson >= 10)
    return "Ese número por persona está alto. Revisa si era el total.";
  if (people * drinksPerPerson * glassMl >= 1000000)
    return "La cuenta ya va en miles de litros. Revisa las cantidades.";
  if (people >= 100) return "Eso ya no es una junta, es un evento.";
  if (people === 18)
    return "18 personas. Hasta la lista de invitados es dieciochera.";
  if (people * drinksPerPerson * glassMl === 1810)
    return "1810 detectado. Esta receta tiene historia.";
  if (people * drinksPerPerson === 9)
    return "Nueve terremotos. La mesa va a necesitar refuerzos.";
  return "";
}
