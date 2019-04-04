![](/ui/src/assets/Logo.svg)

# Image annotation for Machine Learning

Recurrent Neural Networks needs to have annotated images to learn how to get object to recognize in images, that means that you need to give image and _bounding boxes_ of each object to recognize when you train your model. And you will need **a lot** of annotations to ensure a good train!

Imannotate is an API and Web interface built to help to create that dataset. You will be able to manage projects and users to participate to annotation.

## Installation

Since we are including a `docker-compose.yaml` file, the quickest way to install and start the application is to do a `make prod` into your terminal, in the project root folder. 

However,  for the one who like to do it by themself, we have a full _Build your own_ documentation [available into the project's wiki][installation]. 

## Contributing

There's just not one way to contribute to a project and you don't have to be a developer to contribute. If you are a developer, you may want to check our documentation regarding [setting-up your environment to be able to code][contributing-dev]. Otherwise you can:

- [Filling issues][issues]
- Automating Workflows
- Writing documentation & runbooks
- Thinking about long term priorities, [doing feature request][issues]
- ... 

![](https://cl.ly/f66c139391df/non-coding-contributions-signed.png)

## Licence

The license [can be seen here][license]. Please note that we'll enforce signed-off commits and [DCO](https://github.com/integration/dco). 



[contributing-dev]: https://github.com/smileinnovation/imannotate/wiki/Contributing
[installation]: https://github.com/smileinnovation/imannotate/wiki/Installation
[issues]: https://github.com/smileinnovation/imannotate/issues
[license]: /LICENSE