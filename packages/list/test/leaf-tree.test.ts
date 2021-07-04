import {
  LeafBlock,
  LeafTree,
  ListContext,
  NonLeafBlock,
  NonLeafTree,
} from '../src/list-custom';

const context = new ListContext(2);

describe('LeafTree', () => {
  it('append', () => {
    const b3 = context.leafBlock([1, 2, 3]);
    const t6 = context.leafTree(b3, b3, null);
    const r1 = t6.append(10);

    expect(r1.left).toBe(b3);
    expect(r1.right).toBeInstanceOf(LeafBlock);
    expect(r1.right.toArray()).toEqual([1, 2, 3, 10]);
    expect(r1.middle).toBeNull();

    const r2 = r1.append(11);
    expect(r2.left).toBeInstanceOf(LeafBlock);
    expect(r2.left.toArray()).toEqual([1, 2, 3, 1]);
    expect(r2.right).toBeInstanceOf(LeafBlock);
    expect(r2.right.toArray()).toEqual([2, 3, 10, 11]);
    expect(r2.middle).toBeNull();

    const r3 = r2.append(12);
    expect(r3.left).toBeInstanceOf(LeafBlock);
    expect(r3.left.toArray()).toEqual([1, 2, 3, 1]);
    expect(r3.right).toBeInstanceOf(LeafBlock);
    expect(r3.right.toArray()).toEqual([12]);
    expect(r3.middle).toBeInstanceOf(NonLeafBlock);
    expect(r3.middle?.toArray()).toEqual([2, 3, 10, 11]);
  });

  it('appendMiddle', () => {
    const b3 = context.leafBlock([1, 2, 3]);
    const t6 = context.leafTree(b3, b3, null);

    const r1 = t6.appendMiddle(b3);
    expect(r1.toArray()).toEqual([1, 2, 3]);

    const t9 = context.leafTree(b3, b3, context.nonLeafBlock(3, [b3], 1));

    const r2 = t9.appendMiddle(b3);
    expect(r2.toArray()).toEqual([1, 2, 3, 1, 2, 3]);

    const t12 = context.leafTree(
      b3,
      b3,
      context.nonLeafBlock(12, [b3, b3, b3, b3], 1)
    );

    const r3 = t12.appendMiddle(b3);
    expect(r3).toBeInstanceOf(NonLeafTree);
  });

  it('asNormal', () => {
    const b3 = context.leafBlock([1, 2, 3]);
    const t6 = context.leafTree(b3, b3, null);
    expect(t6.asNormal()).toBe(t6);
  });

  it('assumeNonEmpty', () => {
    const b3 = context.leafBlock([1, 2, 3]);
    const t6 = context.leafTree(b3, b3, null);
    expect(t6.assumeNonEmpty()).toBe(t6);
  });

  it('collect', () => {
    const b3 = context.leafBlock([1, 2, 3]);
    const t6 = context.leafTree(b3, b3, null);

    expect(t6.collect((v) => v).toArray()).toEqual([1, 2, 3, 1, 2, 3]);
    expect(t6.collect((_, __, skip) => skip)).toBe(context.empty());
    expect(
      t6
        .collect((v, __, ___, halt) => {
          halt();
          return v;
        })
        .toArray()
    ).toEqual([1]);
  });

  it('concat', () => {
    const b3 = context.leafBlock([1, 2, 3]);
    const t6 = context.leafTree(b3, b3, null);

    expect(t6.concat(context.empty())).toBe(t6);

    const t7 = t6.concat(context.leafBlock([10])) as LeafTree<number>;
    expect(t7.left).toBe(b3);
    expect(t7.middle).toBeNull();
    expect(t7.right.toArray()).toEqual([1, 2, 3, 10]);

    const t8 = t7.concat(b3) as LeafTree<number>;
    expect(t8.left).toBe(b3);
    expect(t8.middle?.toArray()).toEqual([1, 2, 3, 10]);
    expect(t8.right).toBe(b3);

    const t9 = t8.concat(t8) as LeafTree<number>;

    expect(t9.left).toBe(b3);
    expect(t9.right).toBe(b3);
    const m = t9.middle as NonLeafBlock<any, any>;
    expect(m.nrChildren).toBe(4);
    expect(m.children[1]).toBe(b3);
    expect(m.children[2]).toBe(b3);
  });

  it('concatBlock', () => {
    const b3 = context.leafBlock([1, 2, 3]);
    const t6 = context.leafTree(b3, b3, null);

    const r1 = t6.concatBlock(context.leafBlock([10])) as LeafTree<number>;
    expect(r1.middle).toBeNull();
    expect(r1.left).toBe(b3);
    expect(r1.right.toArray()).toEqual([1, 2, 3, 10]);

    const r2 = t6.concatBlock(context.leafBlock([10, 11])) as LeafTree<number>;
    expect(r2.left).toBe(b3);
    expect(r2.right.toArray()).toEqual([10, 11]);
    const m2 = r2.middle as NonLeafBlock<any, any>;
    expect(m2.nrChildren).toBe(1);
    expect(m2.children[0]).toBe(b3);
  });

  it('concatTree', () => {
    const b3 = context.leafBlock([1, 2, 3]);
    const t6 = context.leafTree(b3, b3, null);

    const r1 = t6.concat(t6) as LeafTree<number>;
    const m1 = r1.middle as NonLeafBlock<any, any>;
    expect(r1.left).toBe(b3);
    expect(r1.right).toBe(b3);
    expect(m1.nrChildren).toBe(2);
    expect(m1.children[0]).toBe(b3);
    expect(m1.children[1]).toBe(b3);

    const r2 = r1.concat(r1) as LeafTree<number>;
    const m2 = r2.middle as NonLeafTree<any, any>;
    expect(m2.left.nrChildren).toBe(3);
    expect(m2.right.nrChildren).toBe(3);
    expect(m2.middle).toBeNull();
  });

  it('context', () => {
    const b3 = context.leafBlock([1, 2, 3]);
    const t6 = context.leafTree(b3, b3, null);
    expect(t6.context).toBe(context);
  });

  it('drop', () => {
    const b3 = context.leafBlock([1, 2, 3]);
    const t6 = context.leafTree(b3, b3, null);

    expect(t6.drop(0)).toBe(t6);
    expect(t6.drop(10)).toBe(context.empty());

    expect(t6.drop(3)).toBe(b3);
    expect(t6.drop(-3)).toBe(b3);

    const r1 = t6.drop(2);
    expect(r1).toBeInstanceOf(LeafBlock);
    expect(r1.toArray()).toEqual([3, 1, 2, 3]);

    const r2 = t6.drop(-2);
    expect(r2).toBeInstanceOf(LeafBlock);
    expect(r2.toArray()).toEqual([1, 2, 3, 1]);

    const r3 = t6.drop(1) as LeafTree<number>;
    expect(r3).toBeInstanceOf(LeafTree);
    expect(r3.left.toArray()).toEqual([2, 3]);
    expect(r3.right).toBe(b3);
  });

  it('extendType', () => {
    const b3 = context.leafBlock([1, 2, 3]);
    const t6 = context.leafTree(b3, b3, null);
    expect(t6.extendType<number | string>()).toBe(t6);
  });

  it('filter', () => {
    const b3 = context.leafBlock([1, 2, 3]);
    const t6 = context.leafTree(b3, b3, null);

    expect(t6.filter(() => true)).toBe(t6);
    expect(t6.filter(() => false)).toBe(context.empty());
    const r1 = t6.filter((_, i) => i >= 3);
    expect(r1).toBeInstanceOf(LeafBlock);
    expect(r1.toArray()).toEqual([1, 2, 3]);
  });

  it('first', () => {
    const b3 = context.leafBlock([1, 2, 3]);
    const t6 = context.leafTree(b3, b3, null);

    expect(t6.first()).toBe(1);
  });

  it('flatMap', () => {
    const b3 = context.leafBlock([1, 2, 3]);
    const t6 = context.leafTree(b3, b3, null);

    expect(t6.flatMap((v) => [v]).toArray()).toEqual(t6.toArray());
    expect(t6.flatMap(() => [])).toBe(context.empty());
  });

  it('forEach', () => {
    const b3 = context.leafBlock([1, 2, 3]);
    const t6 = context.leafTree(b3, b3, null);

    const cb = jest.fn();
    t6.forEach(cb);
    expect(cb).toBeCalledTimes(6);
    expect(cb.mock.calls[1][0]).toBe(2);
    expect(cb.mock.calls[1][1]).toBe(1);

    cb.mockReset();

    t6.forEach((_, __, halt) => {
      halt();
      cb();
    });

    expect(cb).toBeCalledTimes(1);
  });

  it('get', () => {
    const b3 = context.leafBlock([1, 2, 3]);
    const t9 = context.leafTree(b3, b3, context.nonLeafBlock(3, [b3], 1));

    expect(t9.get(1)).toBe(2);
    expect(t9.get(1, 'a')).toBe(2);
    expect(t9.get(1, () => 'a')).toBe(2);
    expect(t9.get(4)).toBe(2);
    expect(t9.get(7)).toBe(2);
    expect(t9.get(-2)).toBe(2);
    expect(t9.get(50)).toBeUndefined();
    expect(t9.get(50, 'a')).toBe('a');
    expect(t9.get(50, () => 'a')).toBe('a');
  });

  it('insert', () => {
    const b3 = context.leafBlock([1, 2, 3]);
    const t9 = context.leafTree(b3, b3, context.nonLeafBlock(3, [b3], 1));

    expect(t9.insert(1, [])).toBe(t9);
    expect(t9.insert(1, [10, 11]).toArray()).toEqual([
      1, 10, 11, 2, 3, 1, 2, 3, 1, 2, 3,
    ]);

    expect(t9.insert(-1, [10, 11]).toArray()).toEqual([
      1, 2, 3, 1, 2, 3, 1, 2, 10, 11, 3,
    ]);
  });

  it('isEmpty', () => {
    const b3 = context.leafBlock([1, 2, 3]);
    const t6 = context.leafTree(b3, b3, null);
    expect(t6.isEmpty).toBe(false);
  });

  it('first', () => {
    const b3 = context.leafBlock([1, 2, 3]);
    const t6 = context.leafTree(b3, b3, null);

    expect(t6.last()).toBe(3);
  });

  it('length', () => {
    const b3 = context.leafBlock([1, 2, 3]);
    const t6 = context.leafTree(b3, b3, null);

    expect(t6.length).toBe(6);
    const t9 = t6.concat(b3);
    expect(t9.length).toBe(9);
  });

  it('map', () => {
    const b3 = context.leafBlock([1, 2, 3]);
    const t9 = context.leafTree(b3, b3, context.nonLeafBlock(3, [b3], 1));

    expect(t9.toArray()).toEqual([1, 2, 3, 1, 2, 3, 1, 2, 3]);
    expect(t9.map((v) => v + 1).toArray()).toEqual([2, 3, 4, 2, 3, 4, 2, 3, 4]);
  });

  it('nonEmpty', () => {
    const b3 = context.leafBlock([1, 2, 3]);
    const t6 = context.leafTree(b3, b3, null);

    expect(t6.nonEmpty()).toBe(true);
  });

  it('padTo', () => {
    const b3 = context.leafBlock([1, 2, 3]);
    const t6 = context.leafTree(b3, b3, null);

    expect(t6.padTo(1, 3)).toBe(t6);
    expect(t6.padTo(8, 9).toArray()).toEqual([1, 2, 3, 1, 2, 3, 9, 9]);

    expect(t6.padTo(8, 9, 50).toArray()).toEqual([9, 1, 2, 3, 1, 2, 3, 9]);
  });

  it('prepend', () => {
    const b3 = context.leafBlock([1, 2, 3]);
    const t6 = context.leafTree(b3, b3, null);
    const r1 = t6.prepend(10);

    expect(r1.right).toBe(b3);
    expect(r1.left).toBeInstanceOf(LeafBlock);
    expect(r1.left.toArray()).toEqual([10, 1, 2, 3]);
    expect(r1.middle).toBeNull();

    const r2 = r1.prepend(11);
    expect(r2.right).toBeInstanceOf(LeafBlock);
    expect(r2.right.toArray()).toEqual([3, 1, 2, 3]);
    expect(r2.left).toBeInstanceOf(LeafBlock);
    expect(r2.left.toArray()).toEqual([11, 10, 1, 2]);
    expect(r2.middle).toBeNull();

    const r3 = r2.prepend(12);
    expect(r3.right).toBeInstanceOf(LeafBlock);
    expect(r3.right.toArray()).toEqual([3, 1, 2, 3]);
    expect(r3.left).toBeInstanceOf(LeafBlock);
    expect(r3.left.toArray()).toEqual([12]);
    expect(r3.middle).toBeInstanceOf(NonLeafBlock);
    expect(r3.middle?.toArray()).toEqual([11, 10, 1, 2]);
  });

  it('prependMiddle', () => {
    const b3 = context.leafBlock([1, 2, 3]);
    const t6 = context.leafTree(b3, b3, null);

    const r1 = t6.prependMiddle(b3);
    expect(r1.toArray()).toEqual([1, 2, 3]);

    const t9 = context.leafTree(b3, b3, context.nonLeafBlock(3, [b3], 1));

    const r2 = t9.prependMiddle(b3);
    expect(r2.toArray()).toEqual([1, 2, 3, 1, 2, 3]);

    const t12 = context.leafTree(
      b3,
      b3,
      context.nonLeafBlock(12, [b3, b3, b3, b3], 1)
    );

    const r3 = t12.prependMiddle(b3);
    expect(r3).toBeInstanceOf(NonLeafTree);
  });

  it('remove', () => {
    const b3 = context.leafBlock([1, 2, 3]);
    const t9 = context.leafTree(b3, b3, context.nonLeafBlock(3, [b3], 1));

    expect(t9.remove(0, 10)).toBe(context.empty());
    expect(t9.remove(4, 0)).toBe(t9);
    expect(t9.remove(1, 2).toArray()).toEqual([1, 1, 2, 3, 1, 2, 3]);
  });

  it('repeat', () => {
    const b3 = context.leafBlock([1, 2, 3]);
    const t6 = context.leafTree(b3, b3, null);

    expect(t6.repeat(0)).toBe(t6);
    expect(t6.repeat(1)).toBe(t6);
    expect(t6.repeat(2).toArray()).toEqual(t6.concat(t6).toArray());
    expect(t6.repeat(10).length).toBe(60);
  });

  it('reversed', () => {
    const b3 = context.leafBlock([1, 2, 3]);
    const t9 = context.leafTree(b3, b3, context.nonLeafBlock(3, [b3], 1));

    expect(t9.reversed().toArray()).toEqual([3, 2, 1, 3, 2, 1, 3, 2, 1]);
    expect(t9.reversed().reversed().toArray()).toEqual(t9.toArray());
  });

  it('rotate', () => {
    const b3 = context.leafBlock([1, 2, 3]);
    const t9 = context.leafTree(b3, b3, context.nonLeafBlock(3, [b3], 1));

    expect(t9.rotate(0)).toBe(t9);
    expect(t9.rotate(9)).toBe(t9);
    expect(t9.rotate(-9)).toBe(t9);
    expect(t9.rotate(1).toArray()).toEqual([3, 1, 2, 3, 1, 2, 3, 1, 2]);
    expect(t9.rotate(-2).toArray()).toEqual([3, 1, 2, 3, 1, 2, 3, 1, 2]);
  });

  it('slice', () => {
    const b3 = context.leafBlock([1, 2, 3]);
    const t9 = context.leafTree(b3, b3, context.nonLeafBlock(3, [b3], 1));

    expect(t9.slice({ amount: 10 }, false)).toBe(t9);
    expect(t9.slice({ amount: 10 }, true).toArray()).toEqual(
      t9.reversed().toArray()
    );
    expect(t9.slice({ amount: 3 }, false)).toBe(b3);
    const r1 = t9.slice({ start: 1, amount: 4 }, false);
    expect(r1).toBeInstanceOf(LeafBlock);
    expect(r1.toArray()).toEqual([2, 3, 1, 2]);

    const r2 = t9.slice({ start: 1, amount: 4 }, true);
    expect(r2).toBeInstanceOf(LeafBlock);
    expect(r2.toArray()).toEqual([2, 1, 3, 2]);
  });

  it('splice', () => {
    const b3 = context.leafBlock([1, 2, 3]);
    const t6 = context.leafTree(b3, b3, null);

    expect(t6.splice({ index: 1, remove: 0 })).toBe(t6);
    expect(t6.splice({ index: 1, remove: 2 }).toArray()).toEqual([1, 1, 2, 3]);
    expect(t6.splice({ index: 1, insert: [10, 11] }).toArray()).toEqual([
      1, 10, 11, 2, 3, 1, 2, 3,
    ]);
    expect(
      t6.splice({ index: 1, remove: 2, insert: [10, 11] }).toArray()
    ).toEqual([1, 10, 11, 1, 2, 3]);
  });
});
