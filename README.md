Created by joshLongmire3

# FreeCodeCamp BackEnd: Timestamp Microservice
### User stories:
1. I can pass a string as a parameter, and it will check to see whether that string contains either a unix timestamp or a natural language date (example: January 1, 2012)
2. If it does, it returns both the Unix timestamp and the natural language form of that date.
3. If it does not contain a date or Unix timestamp, it returns null for those properties.

## Example usage:

```url
https://whispering-lake-33456.herokuapp.com/January 1, 2012
https://whispering-lake-33456.herokuapp.com/1325376000
```

## Example output:

```json
{
  "humanReadable": "January 01, 2012",
  "unix": "1325376000"
}
```

## APP URL:
```url
https://whispering-lake-33456.herokuapp.com/
```