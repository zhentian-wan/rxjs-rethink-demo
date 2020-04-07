import { merge, Observable } from 'rxjs'; 
import { map, mapTo, scan, startWith , distinctUntilChanged, shareReplay} from 'rxjs/operators';


const taskStart = new Observable();
const taskCompletions = new Observable();
const showSpinner = new Observable();

const loadUp = taskStart.pipe(mapTo(1));
const loadDown = taskCompletions.pipe(mapTo(-1));





const loadVariations = merge(loadUp, loadDown)
const currentLoads = loadVariations.pipe(
  startWith(0),
  scan((acc, curr) => {
    const newCount = acc + curr;
    return newCount < 0 ? 0: newCount;
  }, 0),
  shareReplay({bufferSize: 1, refCount: true}),
  distinctUntilChanged()
)