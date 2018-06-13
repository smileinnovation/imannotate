# Imannotate

A tool to annotate images with boxes to use that in machine learning projects, or other stuffs.

**Warning** it's a "starting point" that is in enhance step. We are rebuilding the project with authentication, project management, different file generators... 

## How to get it working now ?

```
# package, to develop only
go get -u github.com/smileinnovation/imannotate

# binary, for users
go get -u github.com/smileinnovation/imannotate/imannotate

# Adapt path
ln -s $GOPATH/src/github.com/smileinnovation/imannotate $GOPATH/src/imannotate.io
```

Launch:

```
imannotate -h
```
