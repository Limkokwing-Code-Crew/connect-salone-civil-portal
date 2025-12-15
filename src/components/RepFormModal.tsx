import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Modal } from "@/components/Modal";
import { toast } from "sonner";

export function RepFormModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
    const createRep = useMutation(api.representatives.createRepresentative);
    const districts = useQuery(api.representatives.getDistricts);

    const [formData, setFormData] = useState({
        name: "",
        role: "Member of Parliament",
        district: "Freetown",
        email: "",
        phone: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (!formData.name || !formData.district) {
                toast.error("Name and District are required");
                return;
            }

            await createRep({
                name: formData.name,
                role: formData.role,
                district: formData.district,
                email: formData.email,
                phone: formData.phone,
                // Optional fields
                constituency: "",
                title: "",
                ministry: "",
                office: "",
                officeAddress: ""
            });
            toast.success("Representative added!");
            onOpenChange(false);
            setFormData({ name: "", role: "Member of Parliament", district: "Freetown", email: "", phone: "" });
        } catch (error) {
            console.error(error);
            toast.error("Failed to add representative");
        }
    };

    return (
        <Modal open={open} onOpenChange={onOpenChange} title="Add Representative">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="text-sm font-medium">Full Name</label>
                    <input
                        className="input w-full"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Hon. Mohamed Kamara"
                    />
                </div>
                <div>
                    <label className="text-sm font-medium">Role</label>
                    <select
                        className="select w-full"
                        value={formData.role}
                        onChange={e => setFormData({ ...formData, role: e.target.value })}
                    >
                        <option>Member of Parliament</option>
                        <option>Mayor</option>
                        <option>Councillor</option>
                        <option>Minister</option>
                    </select>
                </div>
                <div>
                    <label className="text-sm font-medium">District</label>
                    <select
                        className="select w-full"
                        value={formData.district}
                        onChange={e => setFormData({ ...formData, district: e.target.value })}
                    >
                        {districts?.map(d => <option key={d}>{d}</option>) || <option>Loading...</option>}
                        <option>Freetown</option>
                        <option>Bo</option>
                    </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <label className="text-sm font-medium">Phone</label>
                        <input
                            className="input w-full"
                            value={formData.phone}
                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="+232..."
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Email</label>
                        <input
                            type="email"
                            className="input w-full"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            placeholder="email@gov.sl"
                        />
                    </div>
                </div>
                <button type="submit" className="btn-primary w-full">Add Representative</button>
            </form>
        </Modal>
    );
}
