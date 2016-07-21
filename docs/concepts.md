# Concepts

Digit2 CMS is a modular flat-file CMS built using Node.js.

## System structure

- Designer (GUI)
- Project Structure File
- Modules

### Designer


### Project Structure file

A project is structured in a tree consisting of modules. Each element in the tree has a unique id that is based on its position in the tree starting from the Root module (id: 0). The id '3$2' means that the module is located in the third subtree of the fourth subtree in the Root module.

#### Compiling:

Compiling is done using an inorder tree walk algorithm on the project tree. The output is sent to an output file (usually html).

### Modules

There are a number of primary modules, such as Text, Images and the Root module.
Module designers can extend these primary modules to create website elements such as menubars, grids and carrousels.
Modules can have Container elements. These container elements can contain a number of supported modules. *Example:* [container supports="image, text" min-count="0" max-count="100"]

#### Properties

Modules can require certain properties. These properties can either be filled in using the Designer or inherited from parent modules. If a property is left blank in the Designer, it will always be inherited.
It is possible for a module to require a certain value for some properties, such as *width* between 0 and 100 px.
Properties can be used in modules using the property insert tag: {property}

#### Scripting

Modules can use javascript to communicate with other modules when Compiling. This can be done using a .js file in the module directory.

(something about the *initialize* event...)
