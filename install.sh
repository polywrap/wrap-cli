#!/bin/sh

# Adapted from https://github.com/teaxyz/setup/blob/main/install.sh

set -e
set -o noglob

# prevent existing env breaking this script
unset POLYWRAP_DESTDIR
unset POLYWRAP_VERSION

unset stop
while test "$#" -gt 0 -a -z "$stop"; do
	case $1 in
	--prefix)
		POLYWRAP_DESTDIR="$2"
		if test -z "$POLYWRAP_DESTDIR"; then
			echo "polywrap: error: --prefix requires an argument" >&2
			exit 1
		fi
		shift;shift;;
	--version)
		POLYWRAP_VERSION="$2"
		if test -z "$POLYWRAP_VERSION"; then
			echo "polywrap: error: --version requires an argument" >&2
			exit 1
		fi
		shift;shift;;
	--yes|-y)
		POLYWRAP_YES=1
		shift;;
	--help|-h)
		echo "polywrap: docs: https://github.com/polywrap/cli/blob/origin-dev/packages/cli/README.md#installation"
		exit;;
	*)
		stop=1;;
	esac
done
unset stop


####################################################################### funcs
prepare() {
	# ensure ⌃C works
	trap "echo; exit" INT

	if test -n "$VERBOSE" -o -n "$GITHUB_ACTIONS" -a -n "$RUNNER_DEBUG"; then
		set -x
	fi

	if test $# -eq 0; then
		MODE="install"
	else
		MODE="exec"
	fi

	HW_TARGET=$(uname)/$(uname -m)

	case $HW_TARGET in
	Darwin/arm64)
		POLYWRAP_OSARCH=macos-arm64;;
	Darwin/x86_64)
		POLYWRAP_OSARCH=macos-x64;;
	Linux/arm64|Linux/aarch64|CYGWIN_NT-10.0/arm64|MSYS_NT-10.0/arm64)
		POLYWRAP_OSARCH=linux-arm64;;
	Linux/x86_64|CYGWIN_NT-10.0/x86_64|MSYS_NT-10.0/x86_64)
		POLYWRAP_OSARCH=linux-x64;;
	*)
		echo "polywrap: error: (currently) unsupported OS or architecture ($HW_TARGET)" >&2
		echo "Let’s talk about it: https://discord.com/invite/Z5m88a5qWu" >&2
		exit 1;;
	esac

	if test -z "$POLYWRAP_DESTDIR"; then
		# update existing installation if found
		if command -v polywrap >/dev/null; then
			set +e
      if [ "$(uname)" = "Darwin" ]; then
          POLYWRAP_DESTDIR=$(stat -f%Y "$(which polywrap)")
      else
          POLYWRAP_DESTDIR=$(readlink -f "$(which polywrap)")
      fi
      POLYWRAP_DESTDIR=$(dirname "$POLYWRAP_DESTDIR")
      # reverse path, split on "/polywrap/" to get the last occurrence, take the second part, reverse again
      # this makes sure we get the correct path even if a user or destination folder is named polywrap
      POLYWRAP_DESTDIR=$(echo "$POLYWRAP_DESTDIR" | rev | awk -F'/parwylop/' '{print $2}' | rev)

      echo Found polywrap in $POLYWRAP_DESTDIR

			if test $? -eq 0 -a -n "$POLYWRAP_DESTDIR"; then
			  case "$POLYWRAP_DESTDIR" in
          */.yarn/*|*/.npm/*|*/node_modules/*)
            echo The existing installation is managed by a JavaScript package manager. If you continue, this script will create a separate installation that may conflict with it.
            unset POLYWRAP_DESTDIR
            ;;
          *)
            ALREADY_INSTALLED=1
            ;;
        esac
			else
				unset POLYWRAP_DESTDIR
			fi
			set -e
		fi

		# we check again: in case the above failed for some reason
		if test -z "$POLYWRAP_DESTDIR"; then
			if test "$MODE" = exec; then
				POLYWRAP_DESTDIR="$(mktemp -dt polywrap-XXXXXX)"
			else
				POLYWRAP_DESTDIR="$HOME/.polywrap"
			fi
		fi
	fi

	if test -z "$CURL"; then
		if command -v curl >/dev/null; then
			CURL="curl -Ssf"
		else
			echo "polywrap: error: you need curl (or set \`\$CURL\`)" >&2
			exit 1
		fi
	fi
}

welcome() {
    cat <<-EoMD

# Hi 👋 Welcome to Polywrap!
* Let's get you set up.
* We'll install polywrap at: $POLYWRAP_DESTDIR
* Everything Polywrap installs goes there.
* (we won't touch anything else)

> docs https://github.com/polywrap/cli/blob/origin-dev/packages/cli/README.md#installation
EoMD

    if test -n "$POLYWRAP_YES"; then
      choice="1"
    else
      cat <<-EoMD

Let's gooooo! 🚀
1) Install polywrap
2) Cancel
EoMD
      printf "Choice: "
      read -r choice
    fi

    if [ "$choice" != "1" ]; then
        cat <<-EoMD

# Aborting! No changes were made.
> Learn more about Polywrap at https://docs.polywrap.io/
EoMD
        echo  #spacer
        exit 1
    fi
    unset choice

    echo #spacer
}

get_polywrap_version() {
	if test -n "$POLYWRAP_VERSION"; then
		return
	fi

	v_sh="$(mktemp)"
	cat <<-EoMD >"$v_sh"
$CURL "https://raw.githubusercontent.com/polywrap/cli/origin-dev/VERSION" | head -n1 > "$v_sh"
EoMD

	echo "Determining polywrap version"
	sh "$v_sh"

	POLYWRAP_VERSION="$(cat "$v_sh")"

	if test -z "$POLYWRAP_VERSION"; then
		echo "failed to get the latest version" >&2
		exit 1
	fi

	POLYWRAP_VERSION_MAJOR="$(echo "$POLYWRAP_VERSION" | cut -d. -f1)"

	echo "Latest polywrap version: v$POLYWRAP_VERSION"
}

fix_links() {
	OLDWD="$PWD"

	link() {
		if test -d "v$1" -a ! -L "v$1"; then
			echo "'v$1' is unexpectedly a directory" >&2
		else
			rm -f "v$1"
			ln -s "v$POLYWRAP_VERSION" "v$1"
		fi
	}

	cd "$POLYWRAP_DESTDIR"/polywrap
	link \*
	link "$(echo "$POLYWRAP_VERSION" | cut -d. -f1)"
	link "$(echo "$POLYWRAP_VERSION" | cut -d. -f1-2)"
	cd "$OLDWD"
}

install() {
	if test -n "$ALREADY_INSTALLED"; then
		TITLE="Updating to polywrap v$POLYWRAP_VERSION"
	else
		TITLE="Fetching polywrap v$POLYWRAP_VERSION"
	fi

	mkdir -p "$POLYWRAP_DESTDIR/polywrap/v$POLYWRAP_VERSION/bin/"
	POLYWRAP_DESTDIR="$(cd "$POLYWRAP_DESTDIR" && pwd)"  # we need this PATH to be an absolute path for later stuff
	POLYWRAP_TMP_SCRIPT="$(mktemp)"
	URL="https://github.com/polywrap/cli/releases/download/$POLYWRAP_VERSION/polywrap-$POLYWRAP_OSARCH"
	echo "set -e; $CURL -L '$URL' -o '$POLYWRAP_DESTDIR/polywrap/v$POLYWRAP_VERSION/bin/polywrap-$POLYWRAP_OSARCH'" > "$POLYWRAP_TMP_SCRIPT"
	echo "$TITLE"
	sh "$POLYWRAP_TMP_SCRIPT"

  POLYWRAP_TMP_SCRIPT="$(mktemp)"
  echo "chmod +x '$POLYWRAP_DESTDIR/polywrap/v$POLYWRAP_VERSION/bin/polywrap-$POLYWRAP_OSARCH';" > "$POLYWRAP_TMP_SCRIPT"
  sh "$POLYWRAP_TMP_SCRIPT"

	fix_links

	if ! test "$MODE" = exec; then
		echo -- "Successfully installed \`$POLYWRAP_DESTDIR/polywrap/v$POLYWRAP_VERSION/bin/polywrap-$POLYWRAP_OSARCH\`"
	fi

	POLYWRAP_EXENAME="$POLYWRAP_DESTDIR/polywrap/v$POLYWRAP_VERSION_MAJOR/bin/polywrap-$POLYWRAP_OSARCH"
}

check_path() {
    if test -n "$POLYWRAP_YES"; then
      choice="1"
    else
      cat <<-EoMD

Should we add $POLYWRAP_DESTDIR/polywrap/v$POLYWRAP_VERSION_MAJOR/bin to your PATH?
This may require your root password.
1) Yes
2) Skip
EoMD
      printf "Choice: "
      read -r choice
    fi

  if [ "$choice" = "1" ]; then
		echo  #spacer

		# NOTE: Binary -a and -o are inherently ambiguous.  Use 'test EXPR1
		#   && test EXPR2' or 'test EXPR1 || test EXPR2' instead.
		# https://man7.org/linux/man-pages/man1/test.1.html
		if test -w /usr/local/bin || (test ! -e /usr/local/bin && mkdir -p /usr/local/bin >/dev/null 2>&1)
		then
			mkdir -p /usr/local/bin
			ln -sf "$POLYWRAP_EXENAME" /usr/local/bin/polywrap
			echo "Added PATH alias at \`/usr/local/bin/polywrap\`"
		elif command -v sudo >/dev/null
		then
			sudo --reset-timestamp
			sudo mkdir -p /usr/local/bin
			sudo ln -sf "$POLYWRAP_EXENAME" /usr/local/bin/polywrap
			echo "Added PATH alias at \`/usr/local/bin/polywrap\`"
		else
			echo  #spacer
			cat <<-EoMD
> sudo command not found.
> try installing sudo
EoMD
		fi

		if ! command -v polywrap >/dev/null
		then
			echo  #spacer
			cat -- <<-EoMD
> It seems \`/usr/local/bin\` isn’t in your PATH, or we couldn't write to it.
\`PATH=$PATH\`
EoMD
		fi
	fi

	echo  #spacer
}

########################################################################## go
prepare "$@"
if test $MODE = install -a -z "$ALREADY_INSTALLED"; then
	welcome
fi
get_polywrap_version
if ! test -f "$POLYWRAP_DESTDIR/polywrap/v$POLYWRAP_VERSION/bin/polywrap-$POLYWRAP_OSARCH"; then
	install
else
	fix_links  # be proactive in repairing the user installation just in case that's what they ran this for
	POLYWRAP_IS_CURRENT=1
	POLYWRAP_EXENAME="$POLYWRAP_DESTDIR/polywrap/v$POLYWRAP_VERSION_MAJOR/bin/polywrap-$POLYWRAP_OSARCH"
fi

case $MODE in
install)
	if ! test -n "$ALREADY_INSTALLED"; then
			check_path
			if test -n "$GITHUB_ACTIONS"; then
				# if the user did call us directly from GHA may as well help them out
				echo "$POLYWRAP_DESTDIR/polywrap/v$POLYWRAP_VERSION_MAJOR/bin" >> "$GITHUB_PATH"
			fi
			echo "You’re all set!"
	elif test -n "$POLYWRAP_IS_CURRENT"; then
		cat <<-EoMD
# The latest version of polywrap is already installed
> $POLYWRAP_DESTDIR/polywrap/v$POLYWRAP_VERSION/bin/polywrap-$POLYWRAP_OSARCH
EoMD
	fi
	echo  #spacer
	;;
exec)
	# ensure we use the just installed polywrap
	export POLYWRAP_PREFIX="$POLYWRAP_DESTDIR"

	if test -z "$ALREADY_INSTALLED" -a -t 1; then
		$POLYWRAP_EXENAME "$@"
		echo  #spacer
	else
		export PATH="$POLYWRAP_PREFIX/polywrap/v*/bin:$PATH"
		exec "$POLYWRAP_EXENAME" "$@"
	fi
	;;
esac