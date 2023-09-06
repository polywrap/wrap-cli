# Assumes user has curl and git installed
# Install pwrup
curl -L https://raw.githubusercontent.com/polywrap/pwr/main/pwrup/install | bash

# Use pwrup to install pwr
$HOME/.pwr/bin/pwrup
# Use pwr to build the script
$HOME/.pwr/bin/pwr js build -f $3 -o build