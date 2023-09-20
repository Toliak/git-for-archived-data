# Git for an Archived Data (GFAD)

A lot of enterprise apps uses archived file as a project.
Those archives may contain raw data in different text formats.
Therefore, an archive content can be tracked using a VCS (Version Control System).

For example, `pptx` file, which is being used to store MS Office PowerPoint document,
is a zip archive with changed extension.

The archive contains:

```
.
│   [Content_Types].xml
│
├───docProps
│       app.xml
│       core.xml
│       thumbnail.jpeg
│
├───ppt
│   │   presentation.xml
│   │   presProps.xml
│   │   tableStyles.xml
│   │   viewProps.xml
│   │
│   ├───slideLayouts
│   │   │   slideLayout1.xml
│   │   │   slideLayout10.xml
│   │   │   slideLayout11.xml
│   ├───slides
│   │   │   slide1.xml
│   │   │
│   │   └───_rels
│   │           slide1.xml.rels
│   │
│   ├───theme
│   │       theme1.xml
│   │
│   └───_rels
│           presentation.xml.rels
│
└───_rels
        .rels
```

As you can see, there is a lot of text files that can be controlled via git.

The project **Git for an Archived Data** provides utility
that automates archive packing and unpacking for
tracking the content of the archive.

# How to use

1. Run `npx git-for-archived-data -a init` to initialize the project.

This step creates two files:

-   `git-for-archived-data.json` - the project configuration file;
-   `.prettierrc` - the configuration file for the code formatter.

Be careful with `xml*` flags in the `.prettierrc`.
It can break the MS Office file if set up wrongly.
`xmlWhitespaceSensitivity` must be `strict`.

2. Edit `git-for-archived-data.json` and configure archive files

3. Run `npx git-for-archived-data -a unpack` to unpack the configured archives

4. Run `npx git-for-archived-data -a pack` to pack the archives back

Also, watch mode `npx git-for-archived-data -a watch` can be used to automatically unpack and pack the archives.

# Use-Cases

-   Git for Proteus
-   Git for MS Office:
    -   Git for MS Word
    -   Git for MS Excel
    -   Git for MS PowerPoint
