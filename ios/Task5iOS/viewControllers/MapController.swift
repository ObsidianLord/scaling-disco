//
//  MapController.swift
//  Task5iOS
//
//  Created by  Igor Anokhin on 18.09.2020.
//  Copyright © 2020  Igor Anokhin. All rights reserved.
//

import UIKit
import MapKit
import CoreLocation

final class MapController: UIViewController {

    @IBOutlet private weak var topView: UIView!
    @IBOutlet private weak var bottomView: UIView!
    @IBOutlet private weak var emotionsViewHight: NSLayoutConstraint! {
        didSet {
            defaultEmotionsViewHight = emotionsViewHight.constant
        }
    }
    
    @IBOutlet private weak var topEmotionLabel: UILabel!
    @IBOutlet private weak var emotionMap: MKMapView!
    @IBOutlet private weak var emotionCollectionView: UICollectionView!
    
    private var defaultEmotionsViewHight: CGFloat = 0
    private var emotionAnnotations = [MKPointAnnotation]()
    private var defaultRegion: MKCoordinateRegion!
    
    private func placeAnnotations() {
        let annotation = MKPointAnnotation()
        annotation.title = "🎧"
        annotation.subtitle = "Музыка"
        annotation.coordinate = CLLocationCoordinate2D(latitude: 59.9318964,                                               longitude: 30.35361647)
        emotionAnnotations.append(annotation)
        
        
        let annotation2 = MKPointAnnotation()
        annotation.title = "🍂"
        annotation.subtitle = "Осень"
        annotation.coordinate = CLLocationCoordinate2D(latitude: 59.93174796,                                               longitude: 30.35364211)
        emotionAnnotations.append(annotation2)
        
        
        emotionMap.showAnnotations(emotionAnnotations, animated: true)
    }

    
    override func viewDidLoad() {
        super.viewDidLoad()
        setDefaultCity(name: "St. Petersburg")
        placeAnnotations()
//        addAnnotations()
    }
    
    
    private func setDefaultCity(name: String) {
        CLGeocoder().geocodeAddressString(name) { (placemarks, error) in
            if let location = placemarks?.first?.location?.coordinate {
                let regionInMeters = 10_000.0
                self.defaultRegion = MKCoordinateRegion(center: location,
                                                       latitudinalMeters: regionInMeters,
                                                       longitudinalMeters: regionInMeters)
                self.emotionMap.setRegion(self.defaultRegion, animated: true)
            }
        }
    }
}


