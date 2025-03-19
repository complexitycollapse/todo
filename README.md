# todo

A very, very minimal TODO app that saves all the TODOs in a single HTML file.

The idea is that you take the window/index.html file from this project and make a copy of it (giving it whatever name you like). To view or edit it you change to the directory where this app's source is and run...

    npm start -- <path to your html file>

This starts an Electron app that displays your html file. You can now add/edit/delete todos to your heart's content via the app. When you save it, your html file will be overwritten, which is how your todos get persisted. No need for a database or any other file.

This also means you can customise the html page any way you want, so long as you don't change the structure of the todos themselves (which will break the javascript). For example, you can change the title or add some styles to change the colours, to make every todo file unique.

Oh, you will need to change by hand the urls in the html that point to the css and javascript files it needs. For example, you might change the `<link rel="stylesheet" href="index.css">` line to something like `<link rel="stylesheet" href="file:///{path to the todo proj source}/window/index.css">`.

There is an example in this project, called todo.html, which is the todo list for this app. You can run it like this:

    npm start -- todo.html

## Features

 - Add TODOs and nested sub-TODOs
 - Move them around using `Ctrl+<arrow key>`
 - Edit the TODO using the box on the top right
 - Add notes to any TODO using the big textarea
 - Drag the middle partition around to resize the two sides

## Lessons Learned

So what are the takeaways from this project?

 - Really good features-to-effort ratio. It doesn't do much but it's surprisingly useful considering how little effort it took.
 - Fast MVP and easy to iterate on.
 - Although it never lost my data, I was unable to trust a data storage system I'd created myself. Would have preferred to keep everything in a database.
 - No easy upgrade path, as all the data and functionality is embedded together in the HTML.
 - Making in hierarchical was a mistake. Tagging is always better than hierarchy.
 - Theming is surprisingly useful as it allows different projects to be visually distinguished.
 - Did the job well, but far from perfectly.
 - Should have separated data from presentation using templates, but that would have increased the effort required.
 - Lots of separate TODO lists is nice for separation but it would also be nice to combine them. That would be easier in a monorepo setup.
 - Visuals are really important for something like this.
 - Shame that neither links nor images could be embedded. Should have leveraged the fact that this is HTML more.

Ultimately I stopped using it because I didn't trust it and there were always more features I wanted, but there was no way to safely migrate the data. Could a database system be made this easy to use? Could it be written so quickly? Possibly, if done right.

Overall though, I was pleased with what I got from a very short-term project. If only all development were this easy.
