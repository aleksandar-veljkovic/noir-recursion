#!/bin/bash

set -eu

json_string="$1"
public_inputs="$2"

vk_hash=$(echo "$json_string" | jq -r '.vkHash')
proofAsFields=$(echo "$json_string" | jq -r '.proofAsFields')
vkAsFields=$(echo "$json_string" | jq -r '.vkAsFields')

#i_p="$3"
#echo "$i_p"
key=("0x00","0x01","0x02","0x03","0x04","0x05","0x06","0x07","0x08","0x09","0x0a","0x0b","0x0c","0x0d","0x0e","0x0f")

cd ./aes_prepare
nargo compile
nargo check

PREPARE_PROVER=./Prover.toml
echo "verification_key = " $vkAsFields>$PREPARE_PROVER
echo "proof = " $proofAsFields>>$PREPARE_PROVER
echo "public_inputs = [" $public_inputs>>$PREPARE_PROVER "]"
echo "key = [" $key >> $PREPARE_PROVER "]"
printf 'key_hash = "%s"\n' "$vk_hash" >> "$PREPARE_PROVER"
echo "i = 1" >>$PREPARE_PROVER

nargo execute
nargo prove
nargo verify

i=$(awk -F'= ' '/i =/ {print $2}' Verifier.toml)
return=$(awk -F'= ' '/return =/ {print $2}' Verifier.toml)
i=$(echo $i | tr -d '"')

echo "{" > prepare.json
echo "  \"i\": \"$i\"," >> prepare.json
echo "  \"return\": $return" >> prepare.json
echo "}" >> prepare.json

exit 0