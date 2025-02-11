use dep::aes;

#[recursive]
fn main(pt: [u8; 16],key: [u8; 16],i: pub Field) -> pub [u8; 16]{
    //let pt = [0x00,0x11,0x22,0x33,0x44,0x55,0x66,0x77,0x88,0x99,0xaa,0xbb,0xcc,0xdd,0xee,0xff];
    //let key = [0x00,0x01,0x02,0x03,0x04,0x05,0x06,0x07,0x08,0x09,0x0a,0x0b,0x0c,0x0d,0x0e,0x0f];
    //let ct = rec_aes(pt,key);
    
    // print(rec_aes(pt,key));
    assert(i==0);
    rec_aes(pt,key)
    
}

pub fn rec_aes(pt: [u8; 16], key: [u8; 16]) -> [u8; 16] {
    let mut state=pt;
    let key_schedule = aes::aes_128_key_schedule(key);

    state = aes::aes_add_key_layer(state,key_schedule[0]);
    state = aes::aes_sbox_layer(state);
    state = aes::aes_shift_rows_layer(state);
    state = aes::aes_mix_column_layer(state);

    state
    
}