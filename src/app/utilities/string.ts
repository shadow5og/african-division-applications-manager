const slugify = (text: string) => text.replaceAll(" ", "-").toLocaleLowerCase();

export { slugify };
