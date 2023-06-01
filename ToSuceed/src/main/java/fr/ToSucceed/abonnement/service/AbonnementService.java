package fr.ToSucceed.abonnement.service;

import fr.ToSucceed.abonnement.repository.IAbonnement;
import fr.ToSucceed.abonnement.model.Abonnement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AbonnementService {
    private final IAbonnement iAbonnement;

    @Autowired
    public AbonnementService(IAbonnement iAbonnement) {
        this.iAbonnement = iAbonnement;
    }

    public List<Abonnement> getAbonnements(){
        return iAbonnement.findAll();
    }

    public void addNewAbonnement(Abonnement abonnement){
        Optional<Abonnement> abonnementOptional = iAbonnement.findAbonnementById(abonnement.getId());
        if (abonnementOptional.isPresent()){
            throw new IllegalStateException("ID taken");
        }
        iAbonnement.save(abonnement);
    }

    public void deleteAbonnement(Integer abonnementID){

        boolean exists = iAbonnement.existsById(abonnementID);
        if(!exists){
            throw new IllegalStateException("Abonnement with id "+abonnementID+" does not exist");
        }
        iAbonnement.deleteById(abonnementID);
    }
}
