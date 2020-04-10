import { Observable, interval, timer, fromEvent } from 'rxjs'; 
import { tap, map, skip, filter, switchMap, takeUntil, takeWhile, take} from 'rxjs/operators';

const anyKeyPressed = fromEvent(document, 'keypress')
  .pipe(
    map((event: KeyboardEvent) => event.key),
    tap((key) => console.log(`key ${key} is pressed`))
  )

function keyPressed (key) {
  return anyKeyPressed.pipe(
    filter(pressedKey => pressedKey === key)
  )
}

function keyCombo(keyCombo) {
  return keyPressed(keyCombo[0])
    .pipe(
      switchMap(() => anyKeyPressed.pipe(
        takeUntil(
          timer(3000).pipe(
            tap(() => console.log('stoped, no futher key detected'))
          )
        ),
        // check from 's' 'd', f'
        takeWhile((keyPressed, index) => {
          console.log(keyPressed, index + 1)
          return keyCombo[index + 1] === keyPressed
        }),
        // skip 's' &' d'
        skip(keyCombo.length - 2),
        // complete it when last 'f' emit
        take(1)
      ))
    )
}

const comboTriggered = keyCombo(["a", "s", "d", "f"])

interval(1000)
  .pipe(takeUntil(comboTriggered))
  .subscribe(
    x => {
    console.log(x)
  },
  err => console.error('not ok'),
  () => console.log('completed')
  )