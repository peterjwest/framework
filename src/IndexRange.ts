export default class IndexRange {
    type: any;
    startIndex = 0;
    count = 0;
    child?: IndexRange;

    /** Gets current index of the IndexRange */
    nextIndex(): number {
        return this.startIndex + this.count;
    }

    /** Increments the count of this IndexRange */
    increment() {
        this.count++;
        return this;
    }

    /** Updates the value of an IndexRange, and all children in the chain */
    updateChildren() {
        if (this.child && this.child.startIndex !== this.nextIndex()) {
            this.child.startIndex = this.nextIndex();
            this.child.updateChildren();
        }
    }

    /** Creates a new IndexRange linked to this one */
    next() {
        this.child = new IndexRange();
        this.child.startIndex = this.nextIndex();
        return this.child;
    }

    setChild(child: IndexRange) {
        this.child = child;
    }
}
