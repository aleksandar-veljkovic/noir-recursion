use dep::std;
use dep::aes;
#[recursive]
fn main(verification_key : [Field; 114], 
    proof : [Field; 93], 
    public_inputs : [Field; 17], 
    key_hash : Field,
    key: [u8; 16],
    i: pub Field,
) ->pub [u8;16]{
    
    std::verify_proof(
        verification_key.as_slice(), 
        proof.as_slice(), 
        public_inputs.as_slice(), 
        key_hash
    );
    
    let mut state = field_array_to_u8_array(public_inputs);
    let key_schedule = aes::aes_128_key_schedule(key);
    state = aes::aes_add_key_layer(state, key_schedule[i]);
    state = aes::aes_sbox_layer(state);
    state = aes::aes_shift_rows_layer(state);
    state = aes::aes_mix_column_layer(state);
    assert(i==public_inputs[0]+1);
    state
}

pub fn field_array_to_u8_array(input: [Field; 17]) -> [u8; 16] {
    let mut result: [u8; 16] = [0; 16];
    for a in 0..16 {
        result[a] = input[a+1] as u8;
    }
    result
}