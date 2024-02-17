type Mapper<TItem> = (index: number) => TItem;

export class ArrayUtils {
  public static countMap<TItem>(length: number, mapper: Mapper<TItem>): TItem[] {
    return Array.from({ length }, (_m, index) => mapper(index));
  }
}
