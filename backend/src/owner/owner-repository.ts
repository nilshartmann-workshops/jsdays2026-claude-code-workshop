export type OwnerRecord = {
  id: string;
  name: string;
};

const owners = new Map<string, OwnerRecord>();

export const ownerRepository = {
  save(owner: OwnerRecord): OwnerRecord {
    owners.set(owner.id, owner);
    return owner;
  },

  findById(id: string): OwnerRecord | undefined {
    return owners.get(id);
  },

  findAllOrderedByName(): OwnerRecord[] {
    return [...owners.values()].sort((a, b) => a.name.localeCompare(b.name));
  },

  deleteAll() {
    owners.clear();
  },
};
