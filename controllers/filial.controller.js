const Filial = require('../models/Filial');


class FilialController {

    // Filial
    async getFilial (req, res) {
        try {
            const filial = await Filial.find();
    
            res.json(filial);
        } catch (error) {
            console.log(error);
            res.status(500).send('Server Error');
        }
    }  
    async createFilial (req, res) {
        try {
            const { title, address } = req.body;
    
            let existingFilial = await Filial.findOne({ address, title });
            if (existingFilial) {
                return res.status(400).json({ message: 'Bunday filial mavjud' });
            }
            if (!title || !address) {
                return res.status(400).json({ message: "Maydon bo'sh bo'lishi mumkin emas" });
            }
    
            const newFilial = new Filial({ 
                title: title || null,
                address: address || null 
            });
            await newFilial.save();
    
            res.json({ message: 'Filial muaffaqiyatli yaratildi' });
        } catch (error) {
            console.log(error);
            res.status(500).send('Server Error');
        }
}
    async deleteFilial (req, res) {
        const { id } = req.params;
        const filialId = req.params.id;

        try {
            // if (!id || id.length !== 24) {
            //     return res
            //     .status(404)
            //     .json(
            //         "ID to'liq emas, 24 ta simvoldan kam yoki ko'p bo'lishi mumkin emas"
            //     );
            // }
            await Filial.findByIdAndDelete(filialId);

            res.json({ message: 'Filial deleted successfully' });
        } catch (error) {
            console.log(error);
            res.status(500).send('Server Error');
        }
    }
    async updateFilial (req, res) {
        const filialId = req.params.id;
        const { title, address } = req.body;
        try {
            // if (!filialId || filialId.length !== 24 ) {
            //     return res
            //     .status(404)
            //     .json(
            //         "ID to'liq emas, 24 ta simvoldan kam yoki ko'p bo'lishi mumkin emas"
            //     );
            // }
            const updatedFilial = await Filial.findByIdAndUpdate(filialId, { title, address }, { new: true });
            if (!updatedFilial) {
                return res.status(404).json({ message: 'Filial not found' });
            }

            res.json(updatedFilial);
        } catch (error) {
            // console.log(error);
            res.status(500).send('Server Error');
        }
    }

    
}
module.exports = new FilialController();