# config-upload

Upload file to s3 by configuration file.

## Install

```sh
yarn global add config-upload
```

## Usage

## CLI
```sh
$ config-upload [options]
```

### options

#### -n, --no-fail-fast
If specify, the process will not exit with failure until finish all tasks.

#### -c, --configs [path]
Specify configuration file path. default is `.uploadrc`.

### --variables

example:

```sh
config-upload --variables '{"revision": "1.2.3"}'
```

## Configurations

### dists
List distination groups.

```json
{
  "dists": {
    "<group name>": {
      "uploader": "<uploader name>",
      "bucket": "<bucket name>",
      "folder": "<folder path>"
    }
  }
}
```

#### group name
Source object described below use this name to specify a distination.

#### uploader
The way to upload. default support `s3`. If not specified, it will use group name as default.

#### bucket
Bucket's name of storage service.

#### folder
Folder's path.

### sources
Sources configurations are loaded by the defined array of hash.

```json
{
  "sources": [
    {
      "dist": "s3",
      "include": "dist/*.js",
      "exclude": "*.test.js"
    },
    { ... other source object }
  ]
}
```

#### dist
Group name described above.

#### include
Includes files that matching pattern. Using [glob].

#### exclude
Excludes files that matching pattern. It takes priority over `include`. Using [glob].

### basic example
```json
{
  "dists": {
    "s3": {
      "bucket": "BUCKET_NAME",
      "folder": "PATH/TO/FOLDER"
    },
  },
  "sources": [
    {
      "dist": "s3",
      "include": "dist/*.js",
      "exclude": "*.test.js"
    },
  ]
}
```

```json
{
  "dists": {
    "s3": {
      "bucket": "SOME_BUCKET",
      "folder": "path/to/folder"
    },
    "custom dist": {
      "uploader": "s3",
      "path": "path/to/[custom_variable]/[name].[ext]"
    }
  },
  "sources": [
    {
      "dist": "s3",
      "include": "dist/*.js",
      "exclude": "*.test.js"
    },
    {
      "dist": "custom dist",
      "include": "dist/"
    }
  ]
}
```

## TODO
- [ ] Customizable file name of distination.
- [ ] Inject veriables from command to configurations.
- [ ] Uploader of Qiniu.

[glob]: https://en.wikipedia.org/wiki/Glob_(programming)
