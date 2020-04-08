import { merge, Observable, interval, Subject, timer } from 'rxjs'; 
import { map, mapTo, scan, startWith , distinctUntilChanged, shareReplay, pairwise, filter, switchMap, takeUntil} from 'rxjs/operators';


const taskStart = new Subject();
const taskCompletions = new Subject();
const showSpinner = new Observable(() => {
  const loadingSpinnerPromise = initLoadingSpinner();

  loadingSpinnerPromise.then(spinner => {
    spinner.show()
  })

  return () => {
    loadingSpinnerPromise.then(spinner => {
      spinner.hide();
    })
  }
});


export function newTaskStarted() {
  taskStart.next();
}

export function existingTaskCompleted() {
  taskCompletions.next()
}

const loadUp = taskStart.pipe(mapTo(1));
const loadDown = taskCompletions.pipe(mapTo(-1));





const loadVariations = merge(loadUp, loadDown)
const currentLoads = loadVariations.pipe(
  startWith(0),
  scan((acc, curr) => {
    const newCount = acc + curr;
    return newCount < 0 ? 0: newCount;
  }, 0),
  distinctUntilChanged(),
  shareReplay({bufferSize: 1, refCount: true})
)




const spinnerDeactivated = currentLoads
  .pipe(
    filter(count => count === 0)
  )

const spinnerActivated = currentLoads
  .pipe(
    pairwise(),
    filter(([prev, curr]) => prev === 0 && curr === 1)
  )




const shouldShowSpinner = spinnerActivated.pipe(
    switchMap(() => timer(2000).pipe(takeUntil(spinnerDeactivated)))
);




  shouldShowSpinner.pipe(
    switchMap(() => showSpinner.pipe(takeUntil(spinnerDeactivated)))
  )