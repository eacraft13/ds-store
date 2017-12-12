# Update & upgrade
sudo apt-get update -qq
sudo apt-get upgrade -y -qq

# Rethinkdb
cd $HOME
source /etc/lsb-release && echo "deb http://download.rethinkdb.com/apt $DISTRIB_CODENAME main" | sudo tee /etc/apt/sources.list.d/rethinkdb.list
wget -qO- https://download.rethinkdb.com/apt/pubkey.gpg | sudo apt-key add -
sudo apt-get update -qq
sudo apt-get install -y -qq rethinkdb
#rethinkdb --bind all

# Node
cd $HOME
sudo apt-get -y -qq install curl build-essential libssl-dev
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.0/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
nvm install node
