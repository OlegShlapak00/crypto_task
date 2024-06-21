import {mergeMap, pipe, retryWhen, throwError, timer} from "rxjs";

export const retryWithDelay = (
  ms:number,
  count:number,
) =>
  pipe(
    retryWhen(errors =>
      errors.pipe(
        mergeMap((err, i) => {
          return i >= count
            ? throwError(err)
            : timer(ms)
        }),
      )
    )
  )
