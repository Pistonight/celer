# celer-wiki

Celer wiki pages and build tools

## Source Structure
The `src` folder should contain the following:
- `Home.md` - the home page
- `_Footer.md` - the footer navigation bar
- `_Sidebar.md` - side bar
- Sub-folders containing pages for sub-categories

Each sub folder can contain `.md` pages or more sub folders. It also must have a file named `order.txt` for the build tool to generate navigation indices

## Make Links
You can specify relative links in the source markdown. The build tool will replace those with absolute path to the wiki site
### Link to A Page
To create a link to a `.md` page, put the relative path in the parenthesis, for example
```markdown
[link to page](./page.md)
```
To link to the index page, put the relative path to `order.txt` in the directory

### Link Images
The build tool also replaces image links with the repo link. Just put the relative path to the image
```markdown
![image alt text](./MyImage.png)
```
### External Links
Links that start with `http` or `https` will not be replaced. Use this kind of links to point to non-wiki pages
```markdown
[Google](https://www.google.com)
```


## Build Process
The build tool will convert `src/folder1/folder2/Title.md` into `build/[folder1][folder2]Title.md`, and modify the pages in the following ways:
- Insert a navigation line at the beginning like `Home / folder 1 / folder 2 / Title`
- Bottom nav line(s) for previous and next page if they exist in `order.txt`
- Replace image link and hyperlinks so they work in the built pages

It also generate index pages for sub folders

`just build` builds for local view, `just release` builds for deploying to GitHub wiki
