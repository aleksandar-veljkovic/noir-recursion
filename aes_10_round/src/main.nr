use dep::aes;
use dep::std;
fn main(verification_key : [Field; 114], 
    proof : [Field; 93], 
    public_inputs : [Field; 33], 
    key_hash : Field,
    key: [u8; 16],
    i: pub Field,
) ->pub [u8;16]{

    let ct = [0x69,0xc4,0xe0,0xd8,0x6a,0x7b,0x04,0x30,0xd8,0xcd,0xb7,0x80,0x70,0xb4,0xc5,0x5a];
    
    std::verify_proof(
        verification_key.as_slice(), 
        proof.as_slice(), 
        public_inputs.as_slice(), 
        key_hash
    );

    let mut state = field_array_to_u8_array(public_inputs);
    let key_schedule = aes::aes_128_key_schedule(key);
    state = aes::aes_add_key_layer(state,key_schedule[i]);
    state = aes::aes_sbox_layer(state);
    state = aes::aes_shift_rows_layer(state);
    state = aes::aes_add_key_layer(state,key_schedule[10]);
    assert(i==public_inputs[0]+1);
    assert(state == ct);
    
    state
}

pub fn field_array_to_u8_array(input: [Field; 33]) -> [u8; 16] {
    let mut result: [u8; 16] = [0; 16];
    for a in 0..16 {
        result[a] = input[a+1] as u8;
    }
    result
}