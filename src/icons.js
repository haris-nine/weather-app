export const loadIcon = async (iconName) => {
  try {
    const iconModule = await import(`./media/${iconName}.svg`)
    return iconModule.default
  } catch (err) {
    console.error(`Error loading icon: ${iconName}`, err)
    return null
  }
}
