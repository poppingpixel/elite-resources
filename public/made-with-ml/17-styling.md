# Code Styling

## Intuition

> Code is read more often than it is written. -- [Guido Van Rossum](https://en.wikipedia.org/wiki/Guido_van_Rossum) (author of Python)

When we write a piece of code, it's almost never the last time we see it or the last time it's edited. So we need to explain what's going on (via [documentation](../documentation/)) and make it easy to read. One of the easiest ways to make code more readable is to follow consistent style and formatting conventions. There are many options when it comes to Python style conventions to adhere to, but most are based on [PEP8](https://www.python.org/dev/peps/pep-0008/) conventions. Different teams follow different conventions and that's perfectly alright. The most important aspects are:

* `consistency`: everyone follows the same standards.
* `automation`: formatting should be largely effortless after initial configuration.

## Tools

We will be using a very popular blend of style and formatting conventions that makes some very opinionated decisions on our behalf (with configurable options).

* [`Black`](https://black.readthedocs.io/en/stable/): an in-place reformatter that (mostly) [adheres](https://black.readthedocs.io/en/stable/the_black_code_style/current_style.html) to PEP8.
* [`isort`](https://pycqa.github.io/isort/): sorts and formats import statements inside Python scripts.
* [`flake8`](https://flake8.pycqa.org/en/latest/index.html): a code linter with stylistic conventions that adhere to PEP8.

## Configuration

Before we can properly use these tools, we'll have to configure them because they may have some discrepancies amongst them since they follow slightly different conventions that extend from PEP8.

### Black

To configure [Black](https://black.readthedocs.io/en/stable/), we could just pass in options using the [CLI method](https://black.readthedocs.io/en/stable/usage_and_configuration/the_basics.html#command-line-options), but it's much cleaner to do this through our `pyproject.toml` file.

``` 
# Black formatting
[tool.black]
line-length = 150
include = '\.pyi?$'
exclude = '''
/(
 .eggs # exclude a few common directories in the
 | .git # root of the project
 | .hg
 | .mypy_cache
 | .tox
 | venv
 | _build
 | buck-out
 | build
 | dist
 )/
'''

```

Here we're telling Black what our maximum line length should and to include and exclude certain file extensions.

> The [pyproject.toml](https://www.python.org/dev/peps/pep-0518/#file-format) was created to establish a more human-readable configuration file that is meant to replace a `setup.py` or `setup.cfg` file and is increasingly adopted by many open-source libraries.

### isort

Next, we're going to configure [isort](https://pycqa.github.io/isort/) in our `pyproject.toml` file (just below Black's configurations):

``` 
# iSort
[tool.isort]
profile = "black"
line_length = 79
multi_line_output = 3
include_trailing_comma = true
virtual_env = "venv"

```

Though there is a [complete list](https://pycqa.github.io/isort/docs/configuration/options) of configuration options for isort, we've decided to set these explicitly so there are no conflicts with Black.

### flake8

Lastly, we'll set up [flake8](https://flake8.pycqa.org/en/latest/index.html) by also adding it's configuration details to out `pyproject.toml` file.

``` 
[tool.flake8]
exclude = "venv"
ignore = ["E501", "W503", "E226"]
# E501: Line too long
# W503: Line break occurred before binary operator
# E226: Missing white space around arithmetic operator

```

Here we're including an `ignore` option to ignore certain [flake8 rules](https://www.flake8rules.com/) so everything works with our Black and isort configurations. And besides defining configuration options here, which are applied globally, we can also choose to specifically ignore certain conventions on a line-by-line basis. Here is an example of how we utilize this:

``` 
# madewithml/config.py
import pretty_errors # NOQA: F401 (imported but unused)

```

By placing the `# NOQA: <error-code>` on a line, we're telling flake8 to do **NO** *Q* uality *A* ssurance for that particular error on this line.

## Usage

To use these tools that we've configured, we have to execute them from the project directory:

``` 
black .
flake8
isort .

```

``` 

black .
All done! ✨ 🍰 ✨
9 files left unchanged.
flake8
python3 -m isort . isort .
Fixing ...

```

Take a look at your files to see all the changes that have been made!

> the `.` signifies that the configuration file for that package is in the current directory

## Makefile

Remembering these three lines to style our code is a bit cumbersome so it's a good idea to create a Makefile. This file can be used to define a set of commands that can be executed with a single command. Here's what our Makefile looks like:

``` 
# Makefile
SHELL = /bin/bash

# Styling
.PHONY: style
style:
 black .
 flake8
 python3 -m isort .
 pyupgrade

# Cleaning
.PHONY: clean
clean: style
 find . -type f -name "*.DS_Store" -ls -delete
 find . | grep -E "(__pycache__|\.pyc|\.pyo)" | xargs rm -rf
 find . | grep -E ".pytest_cache" | xargs rm -rf
 find . | grep -E ".ipynb_checkpoints" | xargs rm -rf
 rm -rf .coverage*

```

> Notice that the `clean` command depends on the `style` command (`clean: style`), which means that `style` will be executed first before `clean` is executed.

> **.PHONY**
> As the name suggests, a Makefile is typically used to *make* a file, where if a file with the name already exists, then the commands below won't be executed. But we're using it in a way where we want to execute some commands with a single alias. Therefore, the `.PHONY: $FILENAME` lines indicate that even if there is a file called `$FILENAME`, go ahead and execute the commands below anyway.

In the [next lesson](../pre-commit/) on [pre-commit](https://pre-commit.com/) we'll learn how to automatically execute this formatting whenever we make changes to our code.