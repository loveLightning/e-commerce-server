export const titleToSlug = (title: string) => {
  let slug: string | undefined

  slug = title.toLowerCase()

  slug = slug.replace(
    /\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\(|\)|\+|\=|\,|\.|\/|\?|\>|\<|\'|\"|\:|\;|_/gi,
    '',
  )

  slug = slug.replace(/ /gi, '-')

  slug = slug.replace(/\-\-\-\-\-/gi, '-')
  slug = slug.replace(/\-\-\-\-/gi, '-')
  slug = slug.replace(/\-\-\-/gi, '-')
  slug = slug.replace(/\-\-/gi, '-')

  slug = '@' + slug + '@'
  slug = slug.replace(/\@\-|\-\@|\@/gi, '')
  return slug
}
