
# Forwarder commerce

Create unique addresses for payments simplifying user experience. Accept payments from any wallet


TODO:
- Only owner or forwardTo can withdraw
- Screenshot system design
- QR generation
- Webhooks
- Basic website? create payment / pay

# Example usage

## Setup

`chmod +x cli.ts`

## Create payment address and register withdrawal job

```bash
./cli.ts payments:create 100 0x0000000000000000000000000000000000000000 POLYGON 0x5a12C6E2CE96F182C4A063117f3FC821D75E40C8
```

## List payments

```bash
./cli.ts payments:find-all
```

## Print payment details

```bash
./cli.ts payments:find <id>
```

## Start withdrawal worker

```bash
./cli.ts withdrawals-jobs:consumer
```

## Example transactions

Deploy forward factory -> `0xaeaaf0b556c1186b4ffd962fee334ebe5e008a443ec4e73f7621950c83199e49`
Forwarder factory at -> `0xA2cd5A70cd0299EF47d76c460930923e69a68Cc7`
Create forwarder -> `0x2b7a9a2a76e314184bf008e443ab37535273e32089eea7a53ff8c260231bf345`
    Forwarder at -> `0xd6518197A18A6664cA7f5Ab5b2F0BD0419359F03`
        Flush native -> `0x0f422b405ea8a0597abf95e20e3a618082e6508dad6b4260e8e2fcaf91d6e23a`
        Flush token -> `0x8502a1507c426c385adc7fb8d045798f1d1cd05f76a7622049e50ac7131edd99`
