import { CardColor } from '../store/themeStore'

export const getCardClasses = (cardColor: CardColor, additionalClasses: string = ''): string => {
  return `${cardColor.bg} ${cardColor.border} ${cardColor.shadow} ${cardColor.hover} border ${additionalClasses}`
}
