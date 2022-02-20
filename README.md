# Git for an Archived Data

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

My project **Git for an Archived Data** provides utility
that automates archive packing and unpacking for
tracking the content of the archive.

# How to use

# Repository content

# Use-Cases

-   Git for Proteus
-   Git for MS Office:
    -   Git for Word
    -   Git for Excel
    -   Git for PowerPoint
