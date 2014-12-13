funcr
=====

static utility methods to mess with javascript functions:

- `o` - compose form left to right
- `curry` - recurrying as long as there are less arguments than required
- `chsig` - change the order in which arguments are passed
- `uncurry` - unshifts the context to the signature

helpers:

- `has` - recurrying property check
- `dot` - recurrying property get-/setter
- `apply`, `call`, `invoke` - recurrying versions of native `call`, `apply`
- `bind`, `bindConstructor` - recurrying version of native or shimmed `bind` where the latter will try to maintain the `prototype` property of the function returned.

for now, please consult the tests for usage details.