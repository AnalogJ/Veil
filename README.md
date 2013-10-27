Veil
====

Angular Application that allows you to securely encrypt and retrieve your SSH keys from Dropbox storage. 

Ideas
====

- __NOTHING__ should ever be uploaded to the nodejs server. Everything should either exist locally, or stored in the Dropbox datastore (encrypted of course)
- Should allow you to generate a new private pem master cert (and force you to save it locally with or without a passphrase)
- Should allow you to select an existing (encrypted) pem master cert that exists locally
- Should show you the strength of any passphrase that is entered. 
- Should allow users to add passphrases to any certificate they upload to dropbox
- Should use dropbox datastore with limited permisions
- Should be accessable as a single page offline application
- Passphrases are never decrypted by default, they must be decrypted on demand.
- Detect when the application has gone offline, and disable changing passphrases, only decryption.

Additional Features
====

- Use a dropzone to allow users to drag and drop ssh keys
- Add tagging so that users can easily find their keys
- Fulltext search in javascreipt
- Use x-editable for inline updating.
- Progress bar when decrypting and encrypting data.
- One-Page-Scroll panels.
- Notifications when invalid input, invalid certificate or encryption failures.


Options
====

- How should the certificates be stored? 
  - Store the encrypted content in the datastore
  - Store the encrypted content as encrypted flat files in dropbox so that in case of a huge failure the certificates could be decrypted manually
- Can the user have multiple master keys?
  - If so, then determine a way to figure out which certificates were encrypted with which master key, possibly using an MD5 hash of the public key?
    - this information seems to be embedded in the encrypted document in plain text. http://security.stackexchange.com/questions/25170/what-information-is-leaked-from-an-openpgp-encrypted-file
