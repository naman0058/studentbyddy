from Crypto.Cipher import DES

def double_des_encrypt(plain_text, key1, key2):
    cipher1 = DES.new(key1, DES.MODE_ECB)
    cipher2 = DES.new(key2, DES.MODE_ECB)
    
    intermediate_result = cipher1.encrypt(plain_text)
    encrypted_result = cipher2.encrypt(intermediate_result)
    
    return encrypted_result

def double_des_decrypt(encrypted_text, key1, key2):
    cipher1 = DES.new(key2, DES.MODE_ECB)
    cipher2 = DES.new(key1, DES.MODE_ECB)
    
    intermediate_result = cipher1.decrypt(encrypted_text)
    decrypted_result = cipher2.decrypt(intermediate_result)
    
    return decrypted_result

if __name__ == "__main__":
    key1 = b'abcdefgh'  # Replace with your 8-byte key
    key2 = b'ijklmnop'  # Replace with your 8-byte key
    
    plain_text = b'This is a secret message'
    
    encrypted_text = double_des_encrypt(plain_text, key1, key2)
    decrypted_text = double_des_decrypt(encrypted_text, key1, key2)
    
    print("Original text:", plain_text)
    print("Encrypted text:", encrypted_text)
    print("Decrypted text:", decrypted_text.decode('utf-8'))


