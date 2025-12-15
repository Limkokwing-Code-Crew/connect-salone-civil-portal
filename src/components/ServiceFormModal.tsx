import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Modal } from "@/components/Modal";
import { toast } from "sonner";

export function ServiceFormModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
    const createService = useMutation(api.services.createService);
    const [formData, setFormData] = useState({
        name: "",
        agency: "",
        fee: "",
        processingTime: "",
        region: "Nationwide"
        // Minimal fields for demo
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (!formData.name || !formData.agency) {
                toast.error("Name and Agency are required");
                return;
            }

            await createService({
                name: formData.name,
                agency: formData.agency,
                fee: formData.fee || "Free",
                processingTime: formData.processingTime || "Instant",
                region: formData.region,
                // Fill required fields with defaults for demo speed
                documents: [],
                locations: [],
                contacts: "N/A",
                notes: "",
                lastVerified: new Date().toISOString(),
                eligibility: "All citizens",
                processSteps: []
            });
            toast.success("Service created!");
            onOpenChange(false);
            setFormData({ name: "", agency: "", fee: "", processingTime: "", region: "Nationwide" });
        } catch (error) {
            console.error(error);
            toast.error("Failed to create service");
        }
    };

    return (
        <Modal open={open} onOpenChange={onOpenChange} title="Add New Service">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="text-sm font-medium">Service Name</label>
                    <input
                        className="input w-full"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Passport Application"
                    />
                </div>
                <div>
                    <label className="text-sm font-medium">Agency</label>
                    <input
                        className="input w-full"
                        value={formData.agency}
                        onChange={e => setFormData({ ...formData, agency: e.target.value })}
                        placeholder="e.g. Immigration Dept"
                    />
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <label className="text-sm font-medium">Fee</label>
                        <input
                            className="input w-full"
                            value={formData.fee}
                            onChange={e => setFormData({ ...formData, fee: e.target.value })}
                            placeholder="e.g. LE 100"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Region</label>
                        <select
                            className="select w-full"
                            value={formData.region}
                            onChange={e => setFormData({ ...formData, region: e.target.value })}
                        >
                            <option>Nationwide</option>
                            <option>Freetown</option>
                            <option>Bo</option>
                            <option>Kenema</option>
                            <option>Makeni</option>
                        </select>
                    </div>
                </div>
                <button type="submit" className="btn-primary w-full">Create Service</button>
            </form>
        </Modal>
    );
}
